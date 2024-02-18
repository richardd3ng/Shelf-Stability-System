import { Condition } from "@prisma/client";
import { ConditionCreationArgs, ConditionUpdateArgs } from "./types";
import { ApiError } from "next/dist/server/api-utils";
import { deleteEntity } from "./deletions";

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
    }
    throw new ApiError(response.status, resJson.message);
};

export const updateCondition = async (
    conditionInfo: ConditionUpdateArgs
): Promise<Condition> => {
    const endpoint = `/api/conditions/${conditionInfo.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ name: conditionInfo.name }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const setConditionAsControl = async (id: number): Promise<Condition> => {
    const endpoint = `/api/conditions/${id}/setAsControl`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const deleteCondition = async (id: number) => {
    const endpoint = `/api/conditions/${id}/delete`;
    try {
        await deleteEntity(endpoint);
        return id;
    } catch (error) {
        throw error;
    }
};
