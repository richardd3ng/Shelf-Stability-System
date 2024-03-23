import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "../error";
import { UNAUTHORIZED_STATUS_CODE } from "../error";

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
