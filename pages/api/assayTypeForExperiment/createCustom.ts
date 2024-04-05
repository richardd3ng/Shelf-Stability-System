import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { AssayTypeForExperiment, AssayType} from "@prisma/client";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";

export default async function createCustomAssayTypeAPI(
    req : NextApiRequest,
    res : NextApiResponse
) {
    let permissionTracker : APIPermissionTracker = {shouldStopExecuting : false};
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting){
        return;
    }
    const {experimentId, name, units, description, technicianId} = req.body;
    try{
        const assayType = await db.assayType.create({
            data : {
                isCustom : true,
                name : name,
                units : units,
                description : description
            }
        });

        const assayTypeForExperiment = await db.assayTypeForExperiment.create({
            select : {
                assayType : true
            },

            data : {
                experimentId : experimentId,
                technicianId : technicianId,
                assayTypeId : assayType.id
            }
        })
        res.status(200).json(assayTypeForExperiment);

    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to create Assay Type on server")
        );
    }




}