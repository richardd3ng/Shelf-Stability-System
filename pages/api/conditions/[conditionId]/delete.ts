import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { INVALID_CONDITION_ID, getConditionID } from "@/lib/api/apiHelpers";
import {
    conditionHasAssaysWithResults,
    conditionIsControl,
} from "@/lib/api/validations";
import { Condition } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import {
    CONFIRMATION_REQUIRED_MESSAGE,
    CONSTRAINT_ERROR_CODE,
} from "@/lib/api/error";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";

export default async function deleteConditionAPI(
    req: NextApiRequest,
    res: NextApiResponse<Condition | ApiError>
) {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }
    const id = getConditionID(req);
    if (id === INVALID_CONDITION_ID) {
        res.status(400).json(getApiError(400, "Condition ID is required"));
        return;
    }
    try {
        if (await conditionIsControl(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "Cannot delete the control condition"
                )
            );
            return;
        }
        if (await conditionHasAssaysWithResults(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "There are assays for this condition which have recorded results"
                )
            );
            return;
        }
        if (req.query.confirm === "true") {
            const deletedCondition: Condition | null =
                await db.condition.delete({
                    where: { id: id },
                });
            if (!deletedCondition) {
                res.status(404).json(
                    getApiError(
                        404,
                        `Condition does not exist or was already deleted`
                    )
                );
                return;
            }
            res.status(200).json(deletedCondition);
        } else {
            res.status(400).json(
                getApiError(400, CONFIRMATION_REQUIRED_MESSAGE)
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to delete condition on server")
        );
    }
}
