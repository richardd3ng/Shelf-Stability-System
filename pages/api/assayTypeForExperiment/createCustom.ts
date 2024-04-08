import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import { AssayTypeInfo } from "@/lib/controllers/types";

export const createCustomAssayTypeAPIHelper = async (
    experimentId: number,
    name: string,
    description?: string,
    units?: string,
    technicianId?: number
): Promise<AssayTypeInfo> => {
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
    return {
        ...assayTypeForExperiment,
        assayType: assayType,
    };
};

export default async function createCustomAssayTypeAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayTypeInfo | ApiError>
) {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }
    const { experimentId, name, units, description, technicianId } = req.body;
    try {
        res.status(200).json(
            await createCustomAssayTypeAPIHelper(
                experimentId,
                name,
                description,
                units,
                technicianId
            )
        );
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to create Assay Type on server")
        );
    }
}
