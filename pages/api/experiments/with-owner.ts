import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/api/db";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { ExperimentWithLocalDate } from "@/lib/controllers/types";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";

export default async function searchExperimentsAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentWithLocalDate[] | ApiError>
) {
    try {
        if (req.method !== "GET") {
            res.status(405).json(getApiError(405, "Method not allowed"));
            return;
        }
        const ownerId = Number(req.query.id);
        if (isNaN(ownerId)) {
            res.status(400).json(getApiError(400, "Invalid owner"));
            return;
        }

        const experiments = await db.experiment.findMany({
            where: {
                ownerId,
            }
        }).then((experiments) => experiments.map((experiment) => dateFieldsToLocalDate(experiment, ["startDate"])));

        res.status(200).json(experiments);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to search for experiments")
        );
    }
}
