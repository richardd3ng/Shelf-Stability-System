import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import {
    INVALID_ASSAY_ID,
    getAssayID,
} from "@/lib/api/apiHelpers";
import { Assay } from "@prisma/client";

export default async function fetchAssay(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
) {
    const id = getAssayID(req);
    if (id === INVALID_ASSAY_ID) {
        res.status(400).json(getApiError(400, "Assay ID is required"));
        return;
    }

    const assay = await db.assay.findUnique({
        where: {
            id: id
        }
    });
    
    if (!assay) {
        res.status(404).json(getApiError(404, "Assay result not found"));
        return;
    }

    res.status(200).json(assay);
}
