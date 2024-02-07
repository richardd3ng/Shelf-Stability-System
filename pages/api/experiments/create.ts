import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { AssayType, Condition, Experiment } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import {
    AssayTypeCreationArgs,
    AssayTypeCreationArgsNoExperimentId,
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
            assayTypeCreationArgsNoExperimentIdArray,
            conditionCreationArgsNoExperimentIdArray,
        } = req.body;
        if (
            !title ||
            !start_date ||
            !assayTypeCreationArgsNoExperimentIdArray ||
            !conditionCreationArgsNoExperimentIdArray ||
            assayTypeCreationArgsNoExperimentIdArray.length === 0 ||
            conditionCreationArgsNoExperimentIdArray.length === 0
        ) {
            res.status(400).json(
                getApiError(
                    400,
                    "Title, Start Date, and at least one assay type and condition are required."
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

        let assayTypeCreationArgsArray: AssayTypeCreationArgs[] =
            assayTypeCreationArgsNoExperimentIdArray.map(
                (assayType: AssayTypeCreationArgsNoExperimentId) => {
                    return {
                        ...assayType,
                        experimentId: createdExperiment.id,
                    };
                }
            );
        await db.assayType.createMany({
            data: assayTypeCreationArgsArray,
        });
        const createdAssayTypes: AssayType[] = await db.assayType.findMany({
            where: {
                experimentId: createdExperiment.id,
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
            assayTypes: createdAssayTypes,
            conditions: createdConditions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to create experiment on server")
        );
    }
}
