import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createAssay(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { experimentId, name } = req.body;
        if (!experimentId || !name) {
            res.status(400).json({
                error: "Experiment ID and Name are required.",
            });
            return;
        }
        const createdAssayType = await db.assayType.create({
            data: {
                experimentId,
                name,
            },
        });
        res.status(200).json(createdAssayType);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
