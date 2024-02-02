import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createManyAssayTypes(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { assayTypes } = req.body;
        if (!assayTypes || assayTypes.length === 0) {
            res.status(400).json({
                error: "At least one assay type is required.",
            });
            return;
        }
        const createdAssayTypes = await db.assayType.createMany({
            data: assayTypes,
        });
        res.status(200).json(createdAssayTypes);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
