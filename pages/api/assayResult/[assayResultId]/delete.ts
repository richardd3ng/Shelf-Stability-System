import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";
import { AssayResult } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse<AssayResult | ApiError>) {
    const assayResultId = Number(req.query.assayResultId);

    if (isNaN(assayResultId)) {
        res.status(400).json(getApiError(400, "Invalid assay result ID"));
        return;
    }

    const assayResult = await db.assayResult.delete({
        where: {
            id: assayResultId
        }
    });

    if (assayResult === null) {
        res.status(404).json(getApiError(404, "Assay result not found"));
        return;
    }

    res.status(200).json(assayResult);
}
