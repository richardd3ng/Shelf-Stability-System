import { NextApiRequest, NextApiResponse } from "next";
import { Experiment } from "@prisma/client";
import { db } from "@/lib/api/db";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";

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
        res.status(500).json(
            getApiError(500, "Failed to query experiments on server")
        );
    }
}
