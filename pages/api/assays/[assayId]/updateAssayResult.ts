import { getAssayID } from "@/lib/api/apiHelpers";
import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";

export default async function updateAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
) {
    try {
        const assayId = getAssayID(req);
        const jsonData = req.body;
        const newResult = jsonData.result;
        const updatedAssay: Assay = await db.assay.update({
            where: {
                id: assayId,
            },
            data: {
                result: newResult,
            },
        });
        res.status(200).json(updatedAssay);
    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to update assay result on server")
        );
    }
}
