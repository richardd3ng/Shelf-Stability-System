import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createManyAssayTypes(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { assays } = req.body;
        if (!assays || assays.length === 0) {
            res.status(200).json({
                message: "No assay types to create.",
            });
            return;
        }
        const createdAssays = await db.assayType.createMany({
            data: assays,
        });
        console.log("created assays: ", createdAssays);
        res.status(200).json(createdAssays);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
