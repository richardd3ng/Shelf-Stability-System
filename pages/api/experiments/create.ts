import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Experiment } from "@prisma/client";
import { getApiError } from "@/lib/api/error";

export default async function createExperiment(
    req: NextApiRequest,
    res: NextApiResponse<Experiment | ApiError>
) {
    try {
        const { title, description, start_date } = req.body;
        if (!title || !start_date) {
            res.status(400).json(
                getApiError(400, "Title and Start Date are required.")
            );
            return;
        }
        const createdExperiment: Experiment | null = await db.experiment.create(
            {
                data: {
                    title,
                    description,
                    start_date,
                },
            }
        );
        res.status(204).json(createdExperiment);
    } catch (error) {
        res.status(500).json(getApiError(500));
    }
}
