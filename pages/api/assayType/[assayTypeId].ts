import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { AssayType } from "@prisma/client";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";

export default async function assayTypeAPI(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        let permissionTracker: APIPermissionTracker = {
            shouldStopExecuting: false,
        };
        await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
        if (permissionTracker.shouldStopExecuting) {
            return;
        }
        const assayTypeId = Number(req.query.assayTypeId);
        if (req.method === "PATCH") {
            await updateAssayType(assayTypeId, req, res);
        }
    } catch (error) {
        res.status(500).json(getApiError(500, "Failed on server"));
    }
}

const updateAssayType = async (
    assayTypeId: number,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { name, units } = req.body;

    var updatedAssayType: AssayType;
    if (name && units) {
        updatedAssayType = await db.assayType.update({
            where: {
                id: assayTypeId,
            },
            data: {
                name: name,
                units: units,
            },
        });
        res.status(200).json(updatedAssayType);
    } else if (name) {
        updatedAssayType = await db.assayType.update({
            where: {
                id: assayTypeId,
            },
            data: {
                name: name,
            },
        });
        res.status(200).json(updatedAssayType);
    } else if (units) {
        updatedAssayType = await db.assayType.update({
            where: {
                id: assayTypeId,
            },
            data: {
                units: units,
            },
        });
        res.status(200).json(updatedAssayType);
    }
};
