import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getExperimentID } from "@/lib/api/apiHelpers";
import { ExperimentInfo } from "@/lib/controllers/types";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/useExperimentId";

export default async function getExperimentInfo(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentInfo | ApiError>
) {
    const experimentId = getExperimentID(req);
    if (experimentId === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    try {
        const [experiment, conditions, assays, assayTypes] = await Promise.all([
            db.experiment.findUnique({
                where: { id: experimentId },
            }),
            db.condition.findMany({
                where: { experimentId: experimentId },
            }),
            db.assay.findMany({
                where: { experimentId: experimentId },
            }),
            db.assayType.findMany({
                where: { experimentId: experimentId },
            }),
        ]);
        if (experiment) {
            res.status(200).json({
                experiment,
                conditions,
                assayTypes,
                assays,
            });
        } else {
            res.status(404).json(
                getApiError(
                    404,
                    `Experiment ${experimentId} does not exist`,
                    "Experiment Not Found"
                )
            );
        }
    } catch {
        res.status(500).json(
            getApiError(
                500,
                `Failed to fetch details for experiment ${experimentId} on server`
            )
        );
    }
}
