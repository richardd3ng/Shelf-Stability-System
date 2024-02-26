import { NextApiRequest, NextApiResponse } from "next";
import { INVALID_CONDITION_ID, getConditionID } from "@/lib/api/apiHelpers";
import { conditionHasAssaysWithResults } from "@/lib/api/validations";
import { CONSTRAINT_ERROR_CODE, getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import { db } from "@/lib/api/db";
import { Condition } from "@prisma/client";

export default async function setConditionAsControlAPI(
    req: NextApiRequest,
    res: NextApiResponse<Condition | ApiError>
) {
    const id = getConditionID(req);
    if (id === INVALID_CONDITION_ID) {
        res.status(400).json(getApiError(400, "Condition ID is required"));
        return;
    }
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
        let newControlCondition: Condition | null = null;
        await db.$transaction(async (tx) => {
            const controlCondition: Condition | null =
                await tx.condition.findFirst({
                    where: {
                        control: true,
                    },
                });
            if (!controlCondition) {
                res.status(404).json(
                    getApiError(
                        404,
                        `Control condition does not exist`,
                        "Condition Not Found"
                    )
                );
                return;
            }
            await tx.condition.update({
                where: {
                    id: controlCondition.id,
                },
                data: {
                    control: false,
                },
            });
            newControlCondition = await tx.condition.findUnique({
                where: {
                    id: id,
                },
            });
            await tx.condition.update({
                where: {
                    id: id,
                },
                data: {
                    control: true,
                },
            });
        });
        if (!newControlCondition) {
            res.status(404).json(
                getApiError(
                    404,
                    `Condition ${id} does not exist or was deleted`,
                    "Condition Not Found"
                )
            );
            return;
        }
        res.status(200).json(newControlCondition);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, `Failed to set condition as control on server`)
        );
    }
}
