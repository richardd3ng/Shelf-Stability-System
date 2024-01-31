import { NextApiRequest, NextApiResponse } from "next";
import { Experiment } from "@prisma/client";
import { db } from "@/lib/api/db";
import { ApiError } from "next/dist/server/api-utils";

export default async function handleSearch(
    req: NextApiRequest,
    res: NextApiResponse<Experiment[] | ApiError>
) {
    try {
        const { query } = req.query;

        const experiments: Experiment[] | null = await db.experiment.findMany({
            where: {
                OR: [
                    { title: { contains: query as string } },
                    { description: { contains: query as string } },
                ],
            },
        });

        res.status(200).json(experiments);
    } catch (error) {
        console.error("Error fetching experiments:", error);
        res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
            name: "Server Error",
        });
    }
}
