import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { AssayTypeForExperiment, AssayType} from "@prisma/client";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";

export default async function assayTypeForExperimentAPI(
    req : NextApiRequest,
    res : NextApiResponse
) {
    

    try{

        let permissionTracker : APIPermissionTracker = {shouldStopExecuting : false};
        await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
        if (permissionTracker.shouldStopExecuting){
            return;
        }
        const assayTypeForExperimentId = Number(req.query.assayTypeForExperimentId);
        if (req.method === "PATCH"){
            await updateTechnician(assayTypeForExperimentId, req, res);
        } else if (req.method === "DELETE"){
            await deleteAssayTypeForExperiment(assayTypeForExperimentId, req, res);
        }

    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed on server")
        );
    }

}

const updateTechnician = async (assayTypeForExperimentId : number, req : NextApiRequest,  res : NextApiResponse, ) => {
    const {technicianId} = req.body;
    if (!technicianId){
        res.status(400).json(getApiError(400, "No technicianId field in request body"));
    }
    

    const assayTypeForExperiment = await db.assayTypeForExperiment.update({
        where : {
            id : assayTypeForExperimentId
        },

        data : {
            technicianId : technicianId,
        }
    })
    res.status(200).json(assayTypeForExperiment);
}

const deleteAssayTypeForExperiment = async (assayTypeForExperimentId : number, req : NextApiRequest, res : NextApiResponse) => {
    const assayTypeForExperiment = await db.assayTypeForExperiment.delete({
        where : {
            id : assayTypeForExperimentId
        }
    })
    res.status(200).json(assayTypeForExperiment);
}