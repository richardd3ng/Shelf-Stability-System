import { NextApiRequest, NextApiResponse } from "next";
import { AssayType } from "@prisma/client";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";

export const getStandardAssayTypesAPIHelper = async (): Promise<
    AssayType[]
> => {
    return await db.assayType.findMany({
        where: {
            isCustom: false,
        },
    });
};

export default async function getStandardAssayTypesAPI(
    _req: NextApiRequest,
    res: NextApiResponse<AssayType[] | Error>
) {
    try {
        res.status(200).json(await getStandardAssayTypesAPIHelper());
    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to create Assay Type on server")
        );
    }
}
