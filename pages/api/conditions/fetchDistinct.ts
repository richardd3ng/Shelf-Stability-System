import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function fetchDistinctConditionNames(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const distinctConditionNames = await db.condition.findMany({
            select: {
                name: true,
            },
            distinct: ["name"],
        });
        res.status(200).json(distinctConditionNames);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
