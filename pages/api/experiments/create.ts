import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createExperiment(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { title, description, start_date } = req.body;
        if (!title || !start_date) {
            res.status(400).json({
                error: "Title and Start Date are required.",
            });
            return;
        }
        const createdExperiment = await db.experiment.create({
            data: {
                title,
                description,
                start_date,
            },
        });
        res.status(200).json(createdExperiment);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
