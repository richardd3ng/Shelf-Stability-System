import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { getExperimentID } from "@/lib/api/apiHelpers";
import { INVALID_EXPERIMENT_ID } from "@/lib/api/apiHelpers";
import { experimentHasAssaysWithResults } from "@/lib/api/validations";

export default async function hasRecordedAssayResults(
    req: NextApiRequest,
    res: NextApiResponse<boolean | ApiError>
) {
    try {
        const id = getExperimentID(req);
        if (id === INVALID_EXPERIMENT_ID) {
            res.status(400).json(
                getApiError(400, "Valid Experiment ID is required.")
            );
            return;
        }
        res.status(200).json(await experimentHasAssaysWithResults(id));
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(
                500,
                "Failed to check for recorded assay results on server"
            )
        );
    }
}
