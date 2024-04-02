import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { Experiment, Prisma } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { CONSTRAINT_ERROR_CODE } from "@/lib/api/error";
import { experimentHasAssaysWithResults } from "@/lib/api/validations";
import { INVALID_EXPERIMENT_ID, getExperimentID } from "@/lib/api/apiHelpers";
import { localDateToJsDate } from "@/lib/datesUtils";
import { LocalDate } from "@js-joda/core";
import { ExperimentWithLocalDate } from "@/lib/controllers/types";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";

export default async function updateExperimentAPI(
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
    const { title, description, startDate, isCanceled } = req.body;
    try {
        if (startDate) {
            if (await experimentHasAssaysWithResults(id)) {
                res.status(CONSTRAINT_ERROR_CODE).json(
                    getApiError(
                        CONSTRAINT_ERROR_CODE,
                        "Cannot update start date of experiment with recorded assay results"
                    )
                );
                return;
            }
        }
        const updateData: { [key: string]: any } = {};
        if (title) {
            updateData.title = title;
        }
        if (description) {
            updateData.description = description;
        }
        if (startDate) {
            updateData.startDate = localDateToJsDate(
                LocalDate.parse(startDate)
            );
        }
        if (isCanceled !== undefined && isCanceled !== null) {
            updateData.isCanceled = isCanceled;
        }
        const updatedExperiment: ExperimentWithLocalDate | null =
            await db.experiment
                .update({
                    where: {
                        id: id,
                    },
                    data: updateData,
                })
                .then((experiment: Experiment) =>
                    dateFieldsToLocalDate(experiment, ["startDate"])
                );
        if (!updatedExperiment) {
            res.status(404).json(getApiError(404, "Experiment does not exist"));
            return;
        }
        res.status(200).json(updatedExperiment);
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (
                error.code === "P2002" &&
                (error.meta?.target as string[])?.includes("title")
            ) {
                res.status(CONSTRAINT_ERROR_CODE).json(
                    getApiError(
                        CONSTRAINT_ERROR_CODE,
                        `An experiment with the name ${req.body.title} already exists`
                    )
                );
                return;
            }
        }
        res.status(500).json(
            getApiError(500, `Failed to update experiment ${id} on server`)
        );
    }
}
