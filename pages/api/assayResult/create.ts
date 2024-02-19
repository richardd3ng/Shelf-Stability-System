import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { AssayResult } from "@prisma/client";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | ApiError>
) {
    const { assayId, result, comment, last_editor } = req.body;
    if (
        assayId === undefined ||
        result === undefined ||
        comment === undefined ||
        last_editor === undefined
    ) {
        res.status(400).json(
            getApiError(
                400,
                "Assay ID, result, comment, and last editor are required."
            )
        );
        return;
    }
    try {
        const createdAssayResult: AssayResult = await db.assayResult.create({
            data: req.body,
        });
        res.status(200).json(createdAssayResult);
    } catch (error) {
        console.error(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, "Failed to create assays on server")
        );
    }
}
