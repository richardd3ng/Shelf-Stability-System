import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { Experiment, Prisma } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { CONSTRAINT_ERROR_CODE } from "@/lib/api/error";
import { experimentHasAssaysWithResults } from "@/lib/api/validations";
import { INVALID_EXPERIMENT_ID, getExperimentID } from "@/lib/api/apiHelpers";

export default async function updateExperimentAPI(
    req: NextApiRequest,
    res: NextApiResponse<Experiment | ApiError>
) {
    const id = getExperimentID(req);
    if (id === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    const { title, description, startDate, ownerId } = req.body;
    try {
        const updateData: { [key: string]: any } = {};
        if (title !== undefined) {
            updateData.title = title;
        }
        if (description !== undefined) {
            updateData.description = description;
        }
        if (startDate !== undefined) {
            if (await experimentHasAssaysWithResults(id)) {
                res.status(CONSTRAINT_ERROR_CODE).json(
                    getApiError(
                        CONSTRAINT_ERROR_CODE,
                        "Cannot update start date of experiment with recorded assay results"
                    )
                );
                return;
            }
            updateData.start_date = startDate;
        }
        if (ownerId !== undefined) {
            updateData.ownerId = ownerId;
        }
        const updatedExperiment: Experiment | null = await db.experiment.update(
            {
                where: {
                    id: id,
                },
                data: updateData,
            }
        );

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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (
                error.code === "P2002" &&
                (error.meta?.target as string[])?.includes("title")
            ) {
                res.status(CONSTRAINT_ERROR_CODE).json(
                    getApiError(
                        CONSTRAINT_ERROR_CODE,
                        `An experiment with the name ${req.body.title} already exists.`
                    )
                );
                return;
            }
        }
        res.status(500).json(
            getApiError(500, "Failed to update experiment on server")
        );
    }
}
