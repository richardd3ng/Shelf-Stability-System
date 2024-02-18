import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { Prisma } from "@prisma/client";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export default async function createManyAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Prisma.BatchPayload | ApiError>
) {
    const { assays } = req.body;
    try {
        const createdAssays: Prisma.BatchPayload = await db.assay.createMany({
            data: assays,
        });
        res.status(200).json(createdAssays);
    } catch (error) {
        console.error(getErrorMessage(error));
        res.status(500).json(
            getApiError(500, "Failed to create assays on server")
        );
    }
}
