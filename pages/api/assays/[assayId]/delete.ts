import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import {
    INVALID_ASSAY_ID,
    getAssayID,
    getErrorMessage,
} from "@/lib/api/apiHelpers";
import { assayHasResult } from "@/lib/api/validations";
import { getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { CONSTRAINT_ERROR_CODE } from "@/lib/api/error";

export default async function deleteAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
): Promise<void> {
    const id = getAssayID(req);
    if (id === INVALID_ASSAY_ID) {
        res.status(400).json(getApiError(400, "Assay ID is required"));
        return;
    }
    try {
        if (await assayHasResult(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "This assay has recorded results and/or comments and cannot be deleted"
                )
            );
            return;
        }
        const deletedAssay: Assay | null = await db.assay.delete({
            where: {
                id: id,
            },
        });
        if (!deletedAssay) {
            res.status(404).json(
                getApiError(
                    404,
                    `Assay does not exist or was already deleted`,
                    "Assay Not Found"
                )
            );
            return;
        }
        res.status(200).json(deletedAssay);
    } catch (error) {
        console.log(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, `Failed to delete assay on server`)
        );
    }
}
