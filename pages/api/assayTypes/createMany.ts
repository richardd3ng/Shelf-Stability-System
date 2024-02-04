import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { AssayType } from "@prisma/client";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/useExperimentId";
import { getApiError } from "@/lib/api/error";

export default async function createManyAssayTypes(
    req: NextApiRequest,
    res: NextApiResponse<AssayType[] | ApiError>
) {
    try {
        const { experimentId, assayTypes } = req.body;
        if (experimentId === INVALID_EXPERIMENT_ID) {
            res.status(400).json(
                getApiError(400, "Valid Experiment ID is required.")
            );
            return;
        }
        if (!assayTypes || assayTypes.length === 0) {
            res.status(204).json([]);
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
        res.status(500).json(
            getApiError(500, "Failed to create assay types on server")
        );
    }
}
