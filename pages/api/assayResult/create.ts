import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { AssayResult } from "@prisma/client";
import { denyReqIfUserIsNotLoggedInAdmin, getUserAndDenyReqIfUserIsNotLoggedIn } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker, denyAPIReq } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNeitherAdminNorTechnicianNorExperimentOwner } from '@/lib/api/auth/acessDeniers';

export default async function createAssayResultAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayResult | ApiError>
) {
    
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
        let permissionTracker : APIPermissionTracker = {shouldStopExecuting : false};
        const user = await getUserAndDenyReqIfUserIsNotLoggedIn(
            req,
            res,
            permissionTracker
        );
        if (permissionTracker.shouldStopExecuting){
            return;
        }
        const assay = await db.assay.findUnique({
            where : {
                id : req.body.assayId
            },
            include : {
                assayType : true
            }
        })
        if (assay && user) {
            await denyReqIfUserIsNeitherAdminNorTechnicianNorExperimentOwner(
                req,
                res,
                user,
                assay.experimentId,
                assay.assayType.technicianId,
                permissionTracker
            );
            if (permissionTracker.shouldStopExecuting) {
                return;
            }
        } else {
            await denyAPIReq(req, res, "An error occurred - the assay with specified id could not be found", permissionTracker);
            return;
        }
        const createdAssayResult: AssayResult = await db.assayResult.create({
            data: req.body,
        });
        res.status(200).json(createdAssayResult);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to create assay result")
        );
    }
}
