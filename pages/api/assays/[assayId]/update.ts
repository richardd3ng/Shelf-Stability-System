import { getErrorMessage } from "@/lib/api/apiHelpers";
import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { assayHasResult } from "@/lib/api/validations";
import { CONSTRAINT_ERROR_CODE } from "@/lib/api/error";
import { getAssayID, INVALID_ASSAY_ID } from "@/lib/api/apiHelpers";

export default async function updateAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
) {
    const id = getAssayID(req);
    if (id === INVALID_ASSAY_ID) {
        res.status(400).json(getApiError(400, "Assay ID is required"));
        return;
    }
    const { conditionId, type, week } = req.body;
    try {
        if (await assayHasResult(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "Cannot update assay with recorded results"
                )
            );
            return;
        }
        const updateData: { [key: string]: any } = {};
        if (conditionId !== undefined) {
            updateData.conditionId = conditionId;
        }
        if (type !== undefined) {
            updateData.type = type;
        }
        if (week !== undefined) {
            updateData.week = week;
        }
        const updatedAssay: Assay = await db.assay.update({
            where: {
                id: id,
            },
            data: updateData,
        });
        res.status(200).json(updatedAssay);
    } catch (error) {
        console.error(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, "Failed to update assay result on server")
        );
    }
}