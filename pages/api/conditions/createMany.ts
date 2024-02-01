import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createManyConditions(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { conditions } = req.body;
        if (!conditions || conditions.length === 0) {
            res.status(400).json({
                error: "At least one Condition is required.",
            });
            return;
        }
        const createdConditions = await db.condition.createMany({
            data: conditions,
        });
        res.status(200).json(createdConditions);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
