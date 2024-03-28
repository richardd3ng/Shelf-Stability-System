import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/api/db";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { ExperimentTable, ExperimentTableInfo } from "@/lib/controllers/types";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";
import { requireQueryFields } from "@/lib/api/apiHelpers";

// Not really needed as its own function, but maybe if we have nested objects
function convertSort(field: string, order: string) {
    return {
        [field]: order,
    };
}

function getUserIDFromUsername(username: string): Promise<number | null> {
    return db.user
        .findUnique({
            where: {
                username: username,
            },
            select: {
                id: true,
            },
        })
        .then((user) => (user ? user.id : null));
}

export default async function searchExperimentsAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentTable | ApiError>
) {
    try {
        const fields = requireQueryFields(
            req,
            [
                "query",
                "user",
                "status",
                "page",
                "page_size",
                "sort_by",
                "sort_order",
            ],
            {
                query: "",
                user: "",
                status: "",
                sort_by: "id",
                sort_order: "asc",
            }
        );

        if (fields instanceof ApiError) {
            res.status(400).json(fields);
            return;
        }

        const { query, queryNumber, user, page, pageSize, status, orderBy } = {
            ...fields,
            queryNumber: Number(fields.query),
            page: Number(fields.page),
            pageSize: Number(fields.page_size),
            orderBy: convertSort(fields.sort_by, fields.sort_order),
        };

        if (isNaN(page) || isNaN(pageSize)) {
            res.status(400).json(getApiError(400, "Invalid page or page_size"));
            return;
        }

        const userID: number | null = await getUserIDFromUsername(user);

        const whereCondition: Prisma.ExperimentWeekViewWhereInput = {
            AND: [
                {
                    OR: [
                        {
                            title: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                        {
                            id: isNaN(queryNumber) ? undefined : queryNumber,
                        },
                    ],
                },
                ...(userID !== null
                    ? [
                          {
                              OR: [
                                  {
                                      owner: user === "" ? undefined : user,
                                  },
                                  {
                                      experiment: {
                                          assayTypes: {
                                              some: {
                                                  technicianId: userID,
                                              },
                                          },
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),
            ],
            isCanceled:
                status === "canceled"
                    ? true
                    : status === "non-canceled"
                    ? false
                    : undefined,
        };

        const [experiments, totalRows] = await Promise.all([
            db.experimentWeekView
                .findMany({
                    where: whereCondition,
                    orderBy: orderBy,
                    take: pageSize,
                    skip: page * pageSize,
                })
                .then<ExperimentTableInfo[]>((experiments) =>
                    experiments.map((experiment) => {
                        const technicianIds: number[] = experiment.technicianIds
                            .split(",")
                            .map(Number);
                        const experimentWithLocalDate = dateFieldsToLocalDate(
                            experiment,
                            ["startDate"]
                        );
                        return {
                            ...experimentWithLocalDate,
                            technicianIds,
                        };
                    })
                ),
            db.experimentWeekView.count({
                where: whereCondition,
            }),
        ]);

        res.status(200).json({
            rows: experiments,
            rowCount: totalRows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to query experiments on server")
        );
    }
}
