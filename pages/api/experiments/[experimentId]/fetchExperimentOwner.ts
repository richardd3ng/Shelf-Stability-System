import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { ExperimentOwner } from "@/lib/controllers/types";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { getExperimentID, INVALID_EXPERIMENT_ID } from "@/lib/api/apiHelpers";

export default async function getExperimentOwnerAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentOwner | ApiError>
) {
    const id = getExperimentID(req);
    if (id === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    try {
        const experiment = await db.experiment.findUnique({
            where: {
                id: id,
            },
            include: {
                owner: true,
            },
        });
        if (experiment) {
            res.status(200).json({
                username: experiment.owner.username,
                displayName: experiment.owner.displayName,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(
                500,
                `Failed to fetch owner for experiment ${id} on server`
            )
        );
    }
}
