import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Experiment } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import { INVALID_EXPERIMENT_ID, getExperimentID } from "@/lib/api/apiHelpers";
import { ExperimentWithLocalDate } from "@/lib/controllers/types";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";

export default async function deleteExperimentAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentWithLocalDate | ApiError>
) {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }
    const id = getExperimentID(req);
    if (id === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    try {
        const canceledExperiment: ExperimentWithLocalDate | null =
            await db.experiment
                .update({
                    where: { id: id },
                    data: { isCanceled: true },
                })
                .then((experiment: Experiment) =>
                    dateFieldsToLocalDate(experiment, ["startDate"])
                );
        if (!canceledExperiment) {
            res.status(404).json(
                getApiError(
                    404,
                    `Experiment ${id} does not exist`,
                    "Experiment Not Found"
                )
            );
            return;
        }
        res.status(200).json(canceledExperiment);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, `Failed to cancel experiment ${id} on server`)
        );
    }
}
