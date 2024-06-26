import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Experiment } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import { experimentHasAssaysWithResults } from "@/lib/api/validations";
import {
    CONFIRMATION_REQUIRED_MESSAGE,
    CONSTRAINT_ERROR_CODE,
} from "@/lib/api/error";
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
        if (await experimentHasAssaysWithResults(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "Cannot delete experiment with recorded assay results"
                )
            );
            return;
        }
        if (req.query.confirm === "true") {
            const deletedExperiment: ExperimentWithLocalDate | null =
                await db.experiment
                    .delete({
                        where: { id: id },
                    })
                    .then((experiment: Experiment) =>
                        dateFieldsToLocalDate(experiment, ["startDate"])
                    );
            if (!deletedExperiment) {
                res.status(404).json(
                    getApiError(
                        404,
                        `Experiment ${id} does not exist or was already deleted`
                    )
                );
                return;
            }
            res.status(200).json(deletedExperiment);
        } else {
            res.status(400).json(
                getApiError(400, CONFIRMATION_REQUIRED_MESSAGE)
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, `Failed to delete experiment ${id} on server`)
        );
    }
}
