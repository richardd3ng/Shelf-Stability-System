import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { INVALID_CONDITION_ID, getConditionID } from "@/lib/api/apiHelpers";
import { Condition } from "@prisma/client";
import { conditionHasAssaysWithResults } from "@/lib/api/validations";
import { CONSTRAINT_ERROR_CODE, getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import { Prisma } from "@prisma/client";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";

export default async function updateConditionAPI(
    req: NextApiRequest,
    res: NextApiResponse<Condition | ApiError>
) {
    await denyReqIfUserIsNotLoggedInAdmin(req, res);
    const id = getConditionID(req);
    if (id === INVALID_CONDITION_ID) {
        res.status(400).json(getApiError(400, "Condition ID is required"));
        return;
    }
    const { name } = req.body;
    try {
        if (await conditionHasAssaysWithResults(id)) {
            res.status(CONSTRAINT_ERROR_CODE).json(
                getApiError(
                    CONSTRAINT_ERROR_CODE,
                    "Cannot edit condition affecting recorded results"
                )
            );
            return;
        }
        const updateData: { [key: string]: any } = {};
        if (name) {
            updateData.name = name;
        }
        const updatedCondition: Condition | null = await db.condition.update({
            where: {
                id: id,
            },
            data: updateData,
        });
        res.status(200).json(updatedCondition);
    } catch (error) {
        console.error(error);
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
        res.status(500).json(
            getApiError(500, `Failed to update condition ${name} on server`)
        );
    }
}
