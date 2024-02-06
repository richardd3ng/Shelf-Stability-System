import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { getExperimentID } from "@/lib/api/apiHelpers";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/experimentDetailPage/useExperimentId";

export default async function hasRecordedAssayResults(
    req: NextApiRequest,
    res: NextApiResponse<boolean | ApiError>
) {
    try {
        const experimentId = getExperimentID(req);
        if (experimentId === INVALID_EXPERIMENT_ID) {
            res.status(400).json(
                getApiError(400, "Valid Experiment ID is required.")
            );
            return;
        }
        const assays: Assay[] = await db.assay.findMany({
            where: {
                experimentId: experimentId,
                result: {
                    not: null,
                },
            },
        });
        const hasRecordedResults = assays.length > 0;
        res.status(200).json(hasRecordedResults);
    } catch (error) {
        res.status(500).json(
            getApiError(
                500,
                "Failed to check for recorded assay results on server"
            )
        );
    }
}
