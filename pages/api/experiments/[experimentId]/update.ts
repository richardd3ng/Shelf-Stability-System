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


export default async function updateExperimentAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentWithLocalDate | ApiError>
) {
    await denyReqIfUserIsNotLoggedInAdmin(req, res);
    const id = getExperimentID(req);
    if (id === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    const { title, description, startDate, userId } = req.body;
    if (userId === undefined) {
        // TODO: also check if userId is an admin
        res.status(409).json(
            getApiError(409, "You must be an admin to update an experiment")
        );
        return;
    }
    if (!title) {
        res.status(400).json(
            getApiError(400, "Experiment title cannot be empty")
        );
        return;
    }
    if (startDate === null) {
        res.status(400).json(
            getApiError(
                400,
                "If provided, experiment start date cannot be empty"
            )
        );
        return;
    }
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
        const updateData: { [key: string]: any } = {
            title: title,
            description: description,
        };
        if (startDate) {
            updateData.start_date = localDateToJsDate(
                LocalDate.parse(startDate)
            );
        }
        const updatedExperiment: ExperimentWithLocalDate | null =
            await db.experiment
                .update({
                    where: {
                        id: id,
                    },
                    data: updateData,
                })
                .then((experiment: Experiment) => dateFieldsToLocalDate(experiment, ["start_date"]));
        if (!updatedExperiment) {
            res.status(404).json(
                getApiError(
                    404,
                    "Experiment does not exist",
                    "Experiment Not Found"
                )
            );
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
