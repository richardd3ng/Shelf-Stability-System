import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
) {
    const { experimentId, conditionId, type, week } = req.body;
    if (
        type === undefined ||
        week === undefined ||
        experimentId === undefined ||
        conditionId === undefined
    ) {
        res.status(400).json(
            getApiError(
                400,
                "Assay type, week, experiment ID, and condition ID are required."
            )
        );
        return;
    }
    try {
        const createdAssay: Assay = await db.assay.create({
            data: req.body,
        });
        res.status(200).json(createdAssay);
    } catch (error) {
        console.error(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, "Failed to create assays on server")
        );
    }
}
