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
    try {
        const assayTypeForExperimentId = Number(req.query.assayTypeForExperimentId);
        if (req.method === "GET") {
            await getAssayTypeForExperiment(assayTypeForExperimentId, req, res);
        }

        let permissionTracker : APIPermissionTracker = {shouldStopExecuting : false};
        await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
        if (permissionTracker.shouldStopExecuting){
            return;
        }
        if (req.method === "PATCH"){
            await updateType(assayTypeForExperimentId, req, res);
        } else if (req.method === "DELETE"){
            await deleteAssayTypeForExperiment(assayTypeForExperimentId, req, res);
        } else {
            res.status(405).json(getApiError(405, "Method not allowed"));
        }

    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to update assay type")
        );
    }

}

const getAssayTypeForExperiment = async (assayTypeForExperimentId : number, req : NextApiRequest, res : NextApiResponse) => {
    const assayTypeForExperiment = await db.assayTypeForExperiment.findUnique({
        where : {
            id : assayTypeForExperimentId
        }
    });

    if (assayTypeForExperiment == null) {
        res.status(404).json(getApiError(404, "Assay type for experiment not found"));
        return;
    }
    res.status(200).json(assayTypeForExperiment);
}

const updateType = async (assayTypeForExperimentId : number, req : NextApiRequest,  res : NextApiResponse) => {
    const {technicianId, name, units, description} = req.body;
    const assayType = await db.assayTypeForExperiment.findUnique({
        where : {
            id : assayTypeForExperimentId
        },
        include : {
            assayType : true
        }
    })
    if (assayType && !assayType.assayType.isCustom){
        const assayTypeForExperiment = await db.assayTypeForExperiment.update({
            where : {
                id : assayTypeForExperimentId
            },
            data : {
                technicianId : technicianId,
            }
        })
        res.status(200).json(assayTypeForExperiment);
    } else {
        if (!assayType){
            return;
        }
        const [assayTypeForExperiment, t] = await Promise.all([
            db.assayTypeForExperiment.update({
                where : {
                    id : assayTypeForExperimentId
                },
                data : {
                    technicianId : technicianId
                }
            }),
            
            db.assayType.update({
                where : {
                    id : assayType.assayTypeId
                },
                data : {
                    name : name,
                    units : units,
                    description : description
                }
            })
            
        ])
        res.status(200).json({...assayTypeForExperiment, assayType : t});
    }

}

const deleteAssayTypeForExperiment = async (assayTypeForExperimentId : number, req : NextApiRequest, res : NextApiResponse) => {
    const typeHasAssays = await db.assayTypeForExperiment.findFirst({
        include : {
            assays : true
        },
        where : {
            id : assayTypeForExperimentId
        }
    });
    if (typeHasAssays && typeHasAssays.assays.length > 0){
        res.status(400).json(getApiError(400, "Cannot delete - this type has assays in the schedule"));
        return;
    }
    const assayTypeForExperiment = await db.assayTypeForExperiment.delete({
        where : {
            id : assayTypeForExperimentId
        }
    })
    res.status(200).json(assayTypeForExperiment);
}