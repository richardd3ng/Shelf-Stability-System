import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import { AssayResult } from "@prisma/client";
import { getErrorMessage } from "@/lib/api/apiHelpers";
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
    const { result, comment } = req.body;
    const updateData: { [key: string]: any } = { last_editor: "rld39" };
    if (result) {
        updateData.result = result;
    }
    if (comment) {
        updateData.comment = comment;
    }
    try {
        const updatedAssayResult: AssayResult | null =
            await db.assayResult.update({
                where: {
                    id: id,
                },
                data: updateData,
            });
        if (!updatedAssayResult) {
            res.status(404).json(
                getApiError(
                    404,
                    "Assay result does not exist",
                    "Assay Result Not Found"
                )
            );
            return;
        }
        res.status(200).json(updatedAssayResult);
    } catch (error) {
        console.error(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, `Failed to update assay result on server`)
        );
    }
}
