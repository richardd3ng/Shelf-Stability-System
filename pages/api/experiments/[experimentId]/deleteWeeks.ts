import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { experimentHasAssaysWithResults } from "@/lib/api/validations";
import {
    INVALID_EXPERIMENT_ID,
    getExperimentID,
    updateExperimentWeeks,
} from "@/lib/api/apiHelpers";
import { ExperimentWeekDeletionResponse } from "@/lib/controllers/types";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";

const deleteAssaysInWeek = async (experimentId: number, week: number) => {
    await db.assay.deleteMany({
        where: {
            experimentId: experimentId,
            week: week,
        },
    });
};

export default async function deleteExperimentWeekAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentWeekDeletionResponse | ApiError>
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
        const experiment = await db.experiment.findUnique({
            select: { weeks: true },
            where: { id },
        });
        if (!experiment) {
            res.status(404).json(
                getApiError(404, `Experiment ${id} does not exist`)
            );
            return;
        }
        const { weeks } = req.body;
        const deletedWeeks: number[] = [];
        const cannotDeleteWeeks: number[] = [];
        await Promise.all(
            weeks.map(async (week: number) => {
                if (await experimentHasAssaysWithResults(id, week)) {
                    cannotDeleteWeeks.push(week);
                } else {
                    await deleteAssaysInWeek(id, week);
                    deletedWeeks.push(week);
                }
            })
        );
        await updateExperimentWeeks(
            id,
            weeks.filter((week: number) => !deletedWeeks.includes(week))
        );
        res.status(200).json({
            experimentId: id,
            deletedWeeks,
            cannotDeleteWeeks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(
                500,
                `Failed to delete weeks for experiment ${id} on server`
            )
        );
    }
}
