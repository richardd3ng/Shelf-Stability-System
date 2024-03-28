import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { AssayTypeForExperiment, AssayType} from "@prisma/client";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";
import { requireQueryFields } from "@/lib/api/apiHelpers";

export default async function createStandardAssayTypeAPI(
    req : NextApiRequest,
    res : NextApiResponse
) {
    let permissionTracker : APIPermissionTracker = {shouldStopExecuting : false};
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting){
        return;
    }
    let {experimentId, assayTypeId} = req.body;
    if (!experimentId || !assayTypeId){
        res.status(400).json(getApiError(400, `Make sure the body includes experimentId and assayTypeId`));
    }
    experimentId = Number(experimentId);
    assayTypeId = Number(assayTypeId);
    try{

        const assayTypeForExperiment = await db.assayTypeForExperiment.create({
            select : {
                assayType : true
            },

            data : {
                experimentId : experimentId,
                technicianId : null,
                assayTypeId : assayTypeId
            }
        })
        res.status(200).json(assayTypeForExperiment);

    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to create Assay Type on server")
        );
    }




}