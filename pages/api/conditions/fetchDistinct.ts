import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function fetchDistinctConditions(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const distinctConditions = await db.condition.findMany({
            select: {
                name: true,
            },
            distinct: ["name"],
        });
        res.status(200).json(distinctConditions);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
