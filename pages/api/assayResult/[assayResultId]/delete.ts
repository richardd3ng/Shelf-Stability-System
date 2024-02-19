import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import {
    INVALID_ASSAY_RESULT_ID,
    getAssayResultID,
    getErrorMessage,
} from "@/lib/api/apiHelpers";
import { AssayResult } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";

export default async function deleteAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | ApiError>
) {
    const id = getAssayResultID(req);
    if (id === INVALID_ASSAY_RESULT_ID) {
        res.status(400).json(getApiError(400, "Assay result ID is required"));
        return;
    }
    try {
        const deletedAssayResult: AssayResult | null =
            await db.assayResult.delete({
                where: { id: id },
            });
        if (!deletedAssayResult) {
            res.status(404).json(
                getApiError(
                    404,
                    `Assay result ${id} does not exist or was already deleted`,
                    "Assay Result Not Found"
                )
            );
            return;
        }
        res.status(200).json(deletedAssayResult);
    } catch (error) {
        console.log(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, `Failed to delete assay result ${id} on server`)
        );
    }
}
