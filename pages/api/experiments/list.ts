import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Experiment } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";

export default async function getExperimentList(
    _req: NextApiRequest,
    res: NextApiResponse<Experiment[] | ApiError>
) {
    try {
        const experiments: Experiment[] = await db.experiment.findMany();
        res.status(200).json(experiments);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to fetch experiments from server")
        );
    }
}
