import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { getExperimentID } from "@/lib/api/apiHelpers";

export default async function hasRecordedAssayResults(
    req: NextApiRequest,
    res: NextApiResponse<boolean | ApiError>
) {
    try {
        const experimentId = getExperimentID(req);
        const assays: Assay[] | null = await db.assay.findMany({
            where: {
                experimentId: experimentId,
                result: {
                    not: null,
                },
            },
        });
        const hasRecordedResults = assays.length > 0;
        res.status(200).json(hasRecordedResults);
    } catch (error) {
        res.status(500).json(
            getApiError(
                500,
                "Failed to check for recorded assay results on server"
            )
        );
    }
}
