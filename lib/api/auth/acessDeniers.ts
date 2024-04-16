import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "../error";
import { UNAUTHORIZED_STATUS_CODE } from "../error";
import { checkIfUserIsExperimentOwner } from './authHelpers';
import { UserWithoutPassword } from "@/lib/controllers/types";

export async function denyAPIReq(
    _req: NextApiRequest,
    res: NextApiResponse,
    message: string,
    permissionTracker: APIPermissionTracker
) {
    permissionTracker.shouldStopExecuting = true;
    res.status(UNAUTHORIZED_STATUS_CODE).json(
        getApiError(UNAUTHORIZED_STATUS_CODE, message)
    );
}

export type APIPermissionTracker = {
    shouldStopExecuting: boolean;
};
// This function can be marked `async` if using `await` inside

export async function denyReqIfUserIsNeitherAdminNorTechnicianNorExperimentOwner(req: NextApiRequest, res: NextApiResponse, user: UserWithoutPassword, experimentId: number, technicianId: number | null, permissionTracker: APIPermissionTracker) {
    try {
        const isAdmin = user.isAdmin;
        const isTechnician = user.id === technicianId;
        const isOwner = await checkIfUserIsExperimentOwner(user, experimentId);
        if (isAdmin || isOwner || isTechnician) {
            return;
        } else {
            denyAPIReq(req, res, "You are neither an admin, technician for this assay type, or owner of this experiment", permissionTracker);
        }

    } catch {
        return res.redirect('/experiment-list');
    }
}

export async function denyReqIfUserIsNeitherAdminNorExperimentOwner(req: NextApiRequest, res: NextApiResponse, user: UserWithoutPassword, experimentId: number, permissionTracker: APIPermissionTracker) {
    try {
        const isAdmin = user.isAdmin;
        const isOwner = await checkIfUserIsExperimentOwner(user, experimentId);
        if (isAdmin || isOwner) {
            return;
        } else {
            denyAPIReq(req, res, "You are neither an admin nor an owner", permissionTracker);
        }

    } catch {
        return res.redirect('/experiment-list');
    }
}
export async function denyReqIfUserIsNotAdmin(req: NextApiRequest, res: NextApiResponse, user: UserWithoutPassword, permissionTracker: APIPermissionTracker) {
    if (!user.isAdmin) {
        await denyAPIReq(req, res, "You are not an admin", permissionTracker);
    }
}

