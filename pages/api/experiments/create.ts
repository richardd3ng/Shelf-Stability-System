import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Condition, Experiment, Prisma } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import {
    ExperimentCreationResponse,
    ExperimentWithLocalDate,
} from "@/lib/controllers/types";
import { LocalDate } from "@js-joda/core";
import { localDateToJsDate } from "@/lib/datesUtils";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";

export default async function createExperimentAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentCreationResponse | ApiError>
) {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }
    const {
        title,
        description,
        startDate,
        conditionCreationArgsNoExperimentIdArray,
        ownerId,
        weeks,
    } = req.body;
    if (ownerId === undefined) {
        res.status(409).json(
            getApiError(409, "Only registered users can create experiments")
        );
        return;
    }
    if (
        !title ||
        !startDate ||
        !conditionCreationArgsNoExperimentIdArray ||
        conditionCreationArgsNoExperimentIdArray.length === 0
    ) {
        res.status(400).json(
            getApiError(
                400,
                "Title, start date, and at least one condition are required"
            )
        );
        return;
    }

    try {
        const createdExperiment: ExperimentWithLocalDate = await db.experiment
            .create({
                data: {
                    title,
                    description,
                    startDate: localDateToJsDate(LocalDate.parse(startDate)),
                    ownerId,
                    isCanceled: false,
                    assayTypes: {
                        create: [1, 2, 3, 4, 5, 6].map((typeId) => ({
                            assayTypeId: typeId,
                            technicianId: null,
                        })),
                    },
                    weeks,
                    conditions: {
                        create: conditionCreationArgsNoExperimentIdArray,
                    },
                },
            })
            .then((experiment: Experiment) =>
                dateFieldsToLocalDate(experiment, ["startDate"])
            );

        const createdConditions: Condition[] = await db.condition.findMany({
            where: {
                experimentId: createdExperiment.id,
            },
        });

        res.status(200).json({
            experiment: createdExperiment,
            conditions: createdConditions,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (
                error.code === "P2002" &&
                (error.meta?.target as string[])?.includes("title")
            ) {
                res.status(400).json(
                    getApiError(
                        400,
                        `An experiment with the name "${title}" already exists`
                    )
                );
                return;
            } else if (
                error.code === "P2003" &&
                error.meta?.field_name === "Experiment_ownerId_fkey (index)"
            ) {
                res.status(409).json(
                    getApiError(
                        409,
                        "Only registered users can create experiments"
                    )
                );
                return;
            } else if (
                error.code === "P2003" &&
                error.meta?.field_name ===
                    "AssayTypeForExperiment_assayTypeId_fkey (index)"
            ) {
                res.status(400).json(
                    getApiError(
                        400,
                        "Default assay types missing or malformed in database, please contact the administrator"
                    )
                );
                return;
            }
        }
        res.status(500).json(
            getApiError(500, "Failed to create experiment on server")
        );
    }
}
