import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Condition, Experiment, Prisma } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import {
    ConditionCreationArgs,
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationResponse,
    ExperimentWithLocalDate,
} from "@/lib/controllers/types";
import { LocalDate, nativeJs } from "@js-joda/core";
import { localDateToJsDate } from "@/lib/datesUtils";

export default async function createExperimentAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentCreationResponse | ApiError>
) {
    const {
        title,
        description,
        start_date,
        conditionCreationArgsNoExperimentIdArray,
        ownerId,
    } = req.body;
    if (
        !title ||
        !start_date ||
        !ownerId ||
        !conditionCreationArgsNoExperimentIdArray ||
        conditionCreationArgsNoExperimentIdArray.length === 0
    ) {
        res.status(400).json(
            getApiError(
                400,
                "Title, start date, and at least one condition are required"
            )
        );
        return;
    }
    try {
        const createdExperiment: ExperimentWithLocalDate = await db.experiment
            .create({
                data: {
                    title,
                    description,
                    start_date: localDateToJsDate(LocalDate.parse(start_date)),
                    ownerId: ownerId,
                },
            })
            .then((experiment: Experiment) => ({
                ...experiment,
                start_date: nativeJs(experiment.start_date).toLocalDate(),
            }));

        let conditionCreationArgsArray: ConditionCreationArgs[] =
            conditionCreationArgsNoExperimentIdArray.map(
                (condition: ConditionCreationArgsNoExperimentId) => {
                    return {
                        ...condition,
                        experimentId: createdExperiment.id,
                    };
                }
            );
        await db.condition.createMany({
            data: conditionCreationArgsArray,
        });
        const createdConditions: Condition[] = await db.condition.findMany({
            where: {
                experimentId: createdExperiment.id,
            },
        });

        res.status(200).json({
            experiment: createdExperiment,
            conditions: createdConditions,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (
                error.code === "P2002" &&
                (error.meta?.target as string[])?.includes("title")
            ) {
                res.status(400).json(
                    getApiError(
                        400,
                        `An experiment with the name "${title}" already exists`
                    )
                );
                return;
            }
        }
        res.status(500).json(
            getApiError(500, "Failed to create experiment on server")
        );
    }
}
