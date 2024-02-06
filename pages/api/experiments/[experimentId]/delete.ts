import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Experiment } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/useExperimentId";
import { getExperimentID } from "@/lib/api/apiHelpers";

export default async function deleteExperiment(
    req: NextApiRequest,
    res: NextApiResponse<Experiment | ApiError>
) {
    const experimentId = getExperimentID(req);
    if (experimentId === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    try {
        const deletedExperiment: Experiment | null = await db.experiment.delete(
            {
                where: { id: experimentId },
            }
        );
        if (!deletedExperiment) {
            res.status(404).json(
                getApiError(
                    404,
                    `Experiment ${experimentId} does not exist or was already deleted`,
                    "Experiment Not Found"
                )
            );
            return;
        }
        res.status(200).json(deletedExperiment);
    } catch (error) {
        res.status(500).json(
            getApiError(
                500,
                `Failed to delete Experiment ${experimentId} on server`
            )
        );
    }
}
