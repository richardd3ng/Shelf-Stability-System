import { NextApiRequest, NextApiResponse } from "next";
import { Experiment, Prisma } from "@prisma/client";
import { db } from "@/lib/api/db";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { ExperimentTable } from "@/lib/controllers/types";

// Be very careful with this function, it's very easy to introduce SQL injection vulnerabilities
function convertSort(field: string | string[] | undefined, order: string | string[] | undefined) {
    if (field === undefined || order === undefined || Array.isArray(field) || Array.isArray(order)) {
        return undefined;
    }
    const newOrder: "asc" | "desc" = order.toLowerCase() === "asc" ? "asc" : "desc";

    switch (field) {
        case "startDate":
            field = "start_date";
        case "id":
        case "title":
            return {
                field: "e." + field,
                order: newOrder
            };
        case "week":
            return {
                field: field,
                order: newOrder
            };
    }

    return undefined;
}

export default async function searchExperiments(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentTable | ApiError>
) {
    try {
        const query = req.query.query !== undefined ? req.query.query : "";
        const queryNumber = Number(query);

        const orderBy = convertSort(req.query.sort_by, req.query.sort_order);
        var page;
        var pageSize;
        try {
            page = parseInt(req.query.page as string);
            pageSize = parseInt(req.query.page_size as string);
        } catch (error) {
            res.status(400).json(
                getApiError(400, "Invalid page or page_size")
            );
            return;
        }

        const [experiments, totalRows] = await Promise.all([
            // TODO look at views instead?
            db.$queryRaw<any[]>`SELECT e.id, e.title, e.start_date, ROUND(EXTRACT(DAY FROM CURRENT_DATE - e.start_date) / 7) as week
                
                FROM public."Experiment" e

                WHERE e.title ILIKE ${`%${query}%`}
                OR e.description ILIKE ${`%${query}%`}
                ${!isNaN(queryNumber) ? Prisma.sql`OR e.id = ${queryNumber}` : Prisma.empty}
                ${orderBy !== undefined ? Prisma.raw(`ORDER BY ${orderBy.field} ${orderBy.order}`) : Prisma.empty}
                LIMIT ${pageSize} OFFSET ${page * pageSize}`
                .then<(Omit<Experiment, 'start_date'> & { startDate: Date, week: number })[]>(
                    experiments => experiments.map(experiment => ({ ...experiment, start_date: undefined, startDate: experiment.start_date }))),
            db.experiment.count({
                where: {
                    OR: [
                        {
                            title: {
                                contains: query as string,
                                mode: "insensitive"
                            }
                        },
                        {
                            description: {
                                contains: query as string,
                                mode: "insensitive"
                            }
                        },
                        {
                            id: isNaN(queryNumber) ? undefined : queryNumber
                        }
                    ]
                }
            })
        ]);

        res.status(200).json({
            rows: experiments,
            rowCount: totalRows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to query experiments on server")
        );
    }
}
