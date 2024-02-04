import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { ConditionNamesResponse } from "@/lib/controllers/types";
import { getApiError } from "@/lib/api/error";

export default async function fetchDistinctConditions(
    _req: NextApiRequest,
    res: NextApiResponse<ConditionNamesResponse[] | ApiError>
) {
    try {
        const distinctConditions: ConditionNamesResponse[] =
            await db.condition.findMany({
                select: {
                    name: true,
                },
                distinct: ["name"],
            });
        res.status(200).json(distinctConditions);
    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to fetch condition names on server")
        );
    }
}
