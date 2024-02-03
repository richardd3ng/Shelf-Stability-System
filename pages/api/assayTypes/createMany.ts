import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/useExperimentId";

export default async function createManyAssayTypes(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { experimentId, assayTypes } = req.body;
        if (experimentId === INVALID_EXPERIMENT_ID) {
            res.status(400).json({
                error: "Valid Experiment ID is required.",
            });
            return;
        }
        if (!assayTypes || assayTypes.length === 0) {
            res.status(200).json({
                message: "No assay types to create.",
            });
            return;
        }
        await db.assayType.createMany({
            data: assayTypes,
        });
        const createdAssayTypes = await db.assayType.findMany({
            where: {
                experimentId: experimentId,
            },
        });
        res.status(200).json(createdAssayTypes);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
