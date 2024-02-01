import { NextApiRequest, NextApiResponse } from "next";
import { Experiment } from "@prisma/client";
import { db } from "@/lib/api/db";
import { ApiError } from "next/dist/server/api-utils";

export default async function searchExperiments(
    req: NextApiRequest,
    res: NextApiResponse<Experiment[] | ApiError>
) {
    try {
        const { query } = req.query;
        let experiments: Experiment[] | null = [];

        if (!isNaN(Number(query))) {
            const experiment: Experiment | null =
                await db.experiment.findUnique({
                    where: { id: parseInt(query as string) },
                });
            if (experiment) {
                experiments = [experiment];
            }
        } else {
            experiments = await db.experiment.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: query as string,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: query as string,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
            });
        }
        res.status(200).json(experiments);
    } catch (error) {
        console.error("Error searching experiments:", error);
        res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
            name: "Server Error",
        });
    }
}
