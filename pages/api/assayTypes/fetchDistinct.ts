import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { AssayTypeNamesResponse } from "@/lib/controllers/types";
import { getApiError } from "@/lib/api/error";

export default async function fetchDistinctAssayTypes(
    _req: NextApiRequest,
    res: NextApiResponse<AssayTypeNamesResponse[] | ApiError>
) {
    try {
        const distinctAssayTypes: AssayTypeNamesResponse[] =
            await db.assayType.findMany({
                select: {
                    name: true,
                },
                distinct: ["name"],
            });
        res.status(200).json(distinctAssayTypes);
    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to fetch assay type names on server")
        );
    }
}
