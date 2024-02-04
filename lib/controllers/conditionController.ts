import { Condition } from "@prisma/client";
import { ConditionCreationArgs, ConditionNamesResponse } from "./types";
import { ApiError } from "next/dist/server/api-utils";

export const createConditions = async (
    conditions: ConditionCreationArgs[]
): Promise<Condition[]> => {
    if (!conditions || conditions.length === 0) {
        return [];
    }
    const endpoint = "/api/conditions/createMany";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            experimentId: conditions[0].experimentId,
            conditions: conditions,
        }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const fetchDistinctConditions = async (): Promise<string[]> => {
    const endpoint = "/api/conditions/fetchDistinct";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        const distinctConditions: string[] = resJson.map(
            (condition: ConditionNamesResponse) => condition.name
        );
        return distinctConditions;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};
