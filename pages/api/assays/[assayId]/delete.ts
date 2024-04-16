import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import {
    INVALID_ASSAY_ID,
    getAssayID,
    parseExperimentWeeks,
    updateExperimentWeeks,
} from "@/lib/api/apiHelpers";
import { assayHasResult } from "@/lib/api/validations";
import {
    CONFIRMATION_REQUIRED_MESSAGE,
    CONSTRAINT_ERROR_CODE,
    getApiError,
} from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";

export default async function deleteAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | string | ApiError>
): Promise<void> {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }

    const id = getAssayID(req);
    if (id === INVALID_ASSAY_ID) {
        res.status(400).json(getApiError(400, "Assay ID is required"));
        return;
    }

    try {
        if (await assayHasResult(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "This assay has recorded results and/or comments and cannot be deleted"
                )
            );
            return;
        }

        if (req.query.confirm === "true") {
            const deletedAssay: Assay | null = await db.assay.delete({
                where: {
                    id: id,
                },
            });
            if (!deletedAssay) {
                res.status(404).json(
                    getApiError(
                        404,
                        `Assay does not exist or was already deleted`
                    )
                );
                return;
            }
            const otherAssayInWeek: Assay | null = await db.assay.findFirst({
                where: {
                    week: deletedAssay.week,
                },
            });
            if (!otherAssayInWeek) {
                const experiment = await db.experiment.findFirst({
                    where: {
                        id: deletedAssay.experimentId,
                    },
                });
                if (experiment) {
                    const weeks: number[] = parseExperimentWeeks(
                        experiment.weeks
                    ).filter((week) => week !== deletedAssay.week);
                    await updateExperimentWeeks(experiment.id, weeks);
                }
            }
            res.status(200).json(deletedAssay);
        } else {
            res.status(400).json(
                getApiError(400, CONFIRMATION_REQUIRED_MESSAGE)
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, `Failed to delete assay on server`)
        );
    }
}
