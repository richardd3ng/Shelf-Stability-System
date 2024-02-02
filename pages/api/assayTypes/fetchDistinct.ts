import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function fetchDistinctAssayTypes(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const distinctAssayTypes = await db.assayType.findMany({
            select: {
                name: true,
            },
            distinct: ["name"],
        });
        res.status(200).json(distinctAssayTypes);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
