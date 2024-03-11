import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { AssayResult } from "@prisma/client";
import { denyReqIfUserIsNotLoggedInAdmin, getUserAndDenyReqIfUserIsNotLoggedIn } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker, denyAPIReq } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNeitherAdminNorExperimentOwner, denyReqIfUserIsNotAdmin } from "@/lib/api/auth/checkIfAdminOrExperimentOwner";

export default async function createAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | ApiError>
) {
    let permissionTracker : APIPermissionTracker = {shouldStopExecuting : false};
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting){
        return;
    }
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
