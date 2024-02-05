import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { Prisma } from "@prisma/client";

export default async function createManyAssay(
    req: NextApiRequest,
    res: NextApiResponse<Prisma.BatchPayload | never[] | ApiError>
) {
    try {
        const { assays } = req.body;
        if (!assays || assays.length === 0) {
            res.status(200).json([]);
            return;
        }
        const createdAssays: Prisma.BatchPayload = await db.assay.createMany({
            data: assays,
        });
        res.status(200).json(createdAssays);
    } catch (error) {
        res.status(500).json(
            getApiError(
                500,
                "Failed to create assays",
                "Assay Creation Internal Server Error"
            )
        );
    }
}
