import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import { AssayResult } from "@prisma/client";
import {
    INVALID_ASSAY_RESULT_ID,
    getAssayResultID,
} from "@/lib/api/apiHelpers";
import { getUserAndDenyReqIfUserIsNotLoggedIn } from "@/lib/api/auth/authHelpers";
import { denyReqIfUserIsNeitherAdminNorExperimentOwner, denyReqIfUserIsNotAdmin } from "@/lib/api/auth/checkIfAdminOrExperimentOwner";
import { denyAPIReq } from "@/lib/api/auth/acessDeniers";

export default async function updateAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | ApiError>
) {
    const id = getAssayResultID(req);
    if (id === INVALID_ASSAY_RESULT_ID) {
        res.status(400).json(getApiError(400, "Assay result ID is required"));
        return;
    }
    const user = await getUserAndDenyReqIfUserIsNotLoggedIn(req, res);
    const assayResult = await db.assayResult.findUnique({
        where : {
            id : id
        },
        include : {
            assay : true
        }
    });
    if (assayResult && user){
        await denyReqIfUserIsNeitherAdminNorExperimentOwner(req, res, user, assayResult.assay.experimentId);
    } else {
        await denyAPIReq(req, res, "An error occurred");
    }
    if (!req.body.last_editor) {
        res.status(400).json(
            getApiError(400, "Last editor is required to update assay result")
        );
        return;
    }
    try {
        const updatedAssayResult: AssayResult | null =
            await db.assayResult.update({
                where: {
                    id: id,
                },
                data: req.body,
            });

        if (!updatedAssayResult) {
            res.status(404).json(
                getApiError(
                    404,
                    "Assay result to update does not exist",
                    "Assay Result Not Found"
                )
            );
            return;
        }
        // delete if both result and comment are empty
        if (
            updatedAssayResult.result === null &&
            updatedAssayResult.comment === null
        ) {
            const deletedAssayResult: AssayResult | null =
                await db.assayResult.delete({
                    where: { id: id },
                });
            if (!deletedAssayResult) {
                res.status(404).json(
                    getApiError(
                        404,
                        "Assay result to delete does not exist",
                        "Assay Result Not Found"
                    )
                );
                return;
            }
            res.status(200).json(deletedAssayResult);
            return;
        }
        res.status(200).json(updatedAssayResult);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, `Failed to update assay result on server`)
        );
    }
}
