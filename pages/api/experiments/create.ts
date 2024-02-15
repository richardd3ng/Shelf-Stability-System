import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Condition, Experiment, Prisma } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import {
    ConditionCreationArgs,
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationResponse,
} from "@/lib/controllers/types";

export default async function createExperiment(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentCreationResponse | ApiError>
) {
    try {
        const {
            title,
            description,
            start_date,
            conditionCreationArgsNoExperimentIdArray,
        } = req.body;
        if (
            !title ||
            !start_date ||
            !conditionCreationArgsNoExperimentIdArray ||
            conditionCreationArgsNoExperimentIdArray.length === 0
        ) {
            res.status(400).json(
                getApiError(
                    400,
                    "Title, Start Date, and at least one condition are required."
                )
            );
            return;
        }
        const createdExperiment: Experiment = await db.experiment.create({
            data: {
                title,
                description,
                start_date,
            },
        });

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
                        `An experiment with the name "${req.body.title}" already exists.`
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
