import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { AssayResult } from "@prisma/client";

export default async function createAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | ApiError>
) {
    if (
        req.body.assayId === null ||
        (req.body.result === null && req.body.comment === null)
    ) {
        res.status(400).json(
            getApiError(
                400,
                "Assay ID and one of result or comment are required."
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
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to create assays on server")
        );
    }
}
