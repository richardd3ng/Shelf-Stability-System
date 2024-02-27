import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import { AssayResult } from "@prisma/client";
import {
    INVALID_ASSAY_RESULT_ID,
    getAssayResultID,
} from "@/lib/api/apiHelpers";

export default async function updateAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | ApiError>
) {
    const id = getAssayResultID(req);
    if (id === INVALID_ASSAY_RESULT_ID) {
        res.status(400).json(getApiError(400, "Assay result ID is required"));
        return;
    }

    const assayResult = await db.assayResult.findUnique({
        where: {
            id: id
        }
    });
    
    if (!assayResult) {
        res.status(404).json(getApiError(404, "Assay result not found"));
        return;
    }

    res.status(200).json(assayResult);
}
