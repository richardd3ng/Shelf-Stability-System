import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Experiment } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";

export default async function getExperimentList(
    req: NextApiRequest,
    res: NextApiResponse<Experiment[] | ApiError>
) {
    try {
        const experiments: Experiment[] | null = await db.experiment.findMany();
        res.status(200).json(experiments);
    } catch (error) {
        console.error("Error fetching experiments: ", error);
        res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
            name: "Server Error",
        });
    }
}
