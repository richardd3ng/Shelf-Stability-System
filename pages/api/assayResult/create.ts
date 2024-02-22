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
    const { assayId, result, comment } = req.body;
    if (assayId === null || (result === null && comment === null)) {
        res.status(400).json(
            getApiError(
                400,
                "Assay ID and one of result or comment are required."
            )
        );
        return;
    }
    try {
        const data = {
            assayId: assayId,
            result: result,
            comment: comment,
            last_editor: "rld39",
        };
        const createdAssayResult: AssayResult = await db.assayResult.create({
            data: data,
        });
        res.status(200).json(createdAssayResult);
    } catch (error) {
        console.error(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, "Failed to create assays on server")
        );
    }
}
