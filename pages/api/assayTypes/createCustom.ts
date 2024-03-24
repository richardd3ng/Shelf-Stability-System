import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { AssayTypeForExperiment, AssayType} from "@prisma/client";
import { db } from "@/lib/api/db";

export default async function createCustomAssayTypeAPI(
    req : NextApiRequest,
    res : NextApiResponse
) {
    let permissionTracker : APIPermissionTracker = {shouldStopExecuting : false};
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting){
        return;
    }
    const {name, description, units, experimentId, technicianId} = req.body;
    try{

    } catch (error) {
        await db.assayTypeForExperiment.create({

            data : {
                experimentId : experimentId,
                technicianId : 1,
                
                
                assayType : {
                    p
                }
            }
        })
    }




}