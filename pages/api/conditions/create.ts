import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { Condition } from "@prisma/client";
import { getApiError } from "@/lib/api/error";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { CONSTRAINT_ERROR_CODE } from "@/lib/api/error";
import { Prisma } from "@prisma/client";

export default async function createConditionAPI(
    req: NextApiRequest,
    res: NextApiResponse<Condition | ApiError>
) {
    const { experimentId, name } = req.body;
    if (experimentId === null || name === null) {
        res.status(400).json(
            getApiError(400, "Experiment ID and condition name are required.")
        );
        return;
    }
    try {
        const createdCondition: Condition = await db.condition.create({
            data: req.body,
        });
        res.status(200).json(createdCondition);
    } catch (error) {
        console.error(getErrorMessage(error));
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismError = error as Prisma.PrismaClientKnownRequestError;
            if (
                prismError.code === "P2002" &&
                Array.isArray(prismError.meta?.target) &&
                ["experimentId", "name"].every((value) =>
                    (prismError.meta?.target as string[]).includes(value)
                )
            ) {
                res.status(CONSTRAINT_ERROR_CODE).json(
                    getApiError(
                        CONSTRAINT_ERROR_CODE,
                        "Condition with the same name already exists for this experiment"
                    )
                );
                return;
            }
        }
        res.status(500).json(
            getApiError(500, `Failed to create condition ${name} on server`)
        );
    }
}
