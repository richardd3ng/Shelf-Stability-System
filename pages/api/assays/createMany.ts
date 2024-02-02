import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createManyAssay(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { assays } = req.body;
        if (!assays || assays.length === 0) {
            res.status(400).json({
                error: "At least one assay is required.",
            });
            return;
        }
        const createdAssays = await db.assay.createMany({
            data: assays,
        });
        res.status(200).json(createdAssays);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
