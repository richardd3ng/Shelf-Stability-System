import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Condition } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";

export default async function createConditionsAPI(
    req: NextApiRequest,
    res: NextApiResponse<Condition[] | ApiError>
) {
    try {
        let permissionTracker: APIPermissionTracker = {
            shouldStopExecuting: false,
        };
        await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
        if (permissionTracker.shouldStopExecuting) {
            return;
        }
        const { experimentId, conditions } = req.body;
        if (!experimentId) {
            res.status(400).json(getApiError(400, "Experiment ID is required"));
            return;
        }
        if (!conditions || conditions.length === 0) {
            res.status(200).json([]);
            return;
        }
        await db.condition.createMany({
            data: conditions,
        });
        const createdConditions: Condition[] = await db.condition.findMany({
            where: {
                experimentId: experimentId,
            },
        });
        if (createdConditions.length === 0) {
            res.status(404).json(
                getApiError(404, "Valid experiment ID is required")
            );
            return;
        }
        res.status(200).json(createdConditions);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to create conditions on server")
        );
    }
}
