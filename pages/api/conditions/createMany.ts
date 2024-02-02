import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/useExperimentId";

export default async function createConditions(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { experimentId, conditions } = req.body;
        if (experimentId === INVALID_EXPERIMENT_ID) {
            res.status(400).json({
                error: "Valid Experiment ID is required.",
            });
            return;
        }
        if (!conditions || conditions.length === 0) {
            res.status(200).json({
                message: "No conditions to create.",
            });
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
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
