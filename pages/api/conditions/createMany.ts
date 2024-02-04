import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Condition } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/useExperimentId";

export default async function createConditions(
    req: NextApiRequest,
    res: NextApiResponse<Condition[] | ApiError>
) {
    try {
        const { experimentId, conditions } = req.body;
        if (experimentId === INVALID_EXPERIMENT_ID) {
            res.status(400).json(
                getApiError(400, "Valid Experiment ID is required")
            );
            return;
        }
        if (!conditions || conditions.length === 0) {
            res.status(200).json([]);
            return;
        }
        await db.condition.createMany({
            data: conditions,
        });
        const createdConditions = await db.condition.findMany({
            where: {
                experimentId: experimentId,
            },
        });
        res.status(200).json(createdConditions);
    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to create conditions on server")
        );
    }
}
