import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import { AssayTypeInfo } from "@/lib/controllers/types";

export default async function createCustomAssayTypeAPI(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<AssayTypeInfo | ApiError | void> {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }
    const { experimentId, name, units, description, technicianId } = req.body;
    try {
        const assayType = await db.assayType.create({
            data: {
                isCustom: true,
                name: name,
                units: units,
                description: description,
            },
        });
        const assayTypeForExperiment = await db.assayTypeForExperiment.create({
            data: {
                experimentId: experimentId,
                technicianId: technicianId,
                assayTypeId: assayType.id,
            },
        });
        res.status(200).json({
            ...assayTypeForExperiment,
            assayType: assayType,
        });
    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to create Assay Type on server")
        );
    }
}
