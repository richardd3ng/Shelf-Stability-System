import { INVALID_ASSAY_ID, getAssayID } from "@/lib/api/apiHelpers";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";
import { AssayResult } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

export default async function fetchAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | null | ApiError>
) {
    const id = getAssayID(req);
    if (id === INVALID_ASSAY_ID) {
        res.status(400).json(getApiError(400, "Assay ID is required"));
        return;
    }

    const result = await db.assayResult.findFirst({
        where: {
            assayId: id
        }
    });

    res.status(200).json(result);
}
    