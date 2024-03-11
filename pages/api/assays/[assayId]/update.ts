import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { assayHasResult } from "@/lib/api/validations";
import { CONSTRAINT_ERROR_CODE } from "@/lib/api/error";
import { getAssayID, INVALID_ASSAY_ID } from "@/lib/api/apiHelpers";
import { Prisma } from "@prisma/client";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";

export default async function updateAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
) {
    await denyReqIfUserIsNotLoggedInAdmin(req, res);
    const id = getAssayID(req);
    if (id === INVALID_ASSAY_ID) {
        res.status(400).json(getApiError(400, "Assay ID is required"));
        return;
    }
    const { conditionId, type, week } = req.body;
    try {
        if (await assayHasResult(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "Cannot update assay with recorded results"
                )
            );
            return;
        }
        const updateData: { [key: string]: any } = {};
        if (conditionId !== null && conditionId !== undefined) {
            updateData.conditionId = conditionId;
        }
        if (type !== null && type !== undefined) {
            updateData.assayTypeId = type;
        }
        if (week !== null && week !== undefined) {
            updateData.week = week;
        }
        const updatedAssay: Assay | null = await db.assay.update({
            where: {
                id: id,
            },
            data: updateData,
        });
        res.status(200).json(updatedAssay);
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismError = error as Prisma.PrismaClientKnownRequestError;
            if (
                prismError.code === "P2002" &&
                Array.isArray(prismError.meta?.target) &&
                ["experimentId", "conditionId", "week", "type"].every((value) =>
                    (prismError.meta?.target as string[]).includes(value)
                )
            ) {
                res.status(CONSTRAINT_ERROR_CODE).json(
                    getApiError(
                        CONSTRAINT_ERROR_CODE,
                        "Assay with the same type and week already exists for this condition"
                    )
                );
                return;
            }
        }
        res.status(500).json(
            getApiError(500, "Failed to update assay result on server")
        );
    }
}
