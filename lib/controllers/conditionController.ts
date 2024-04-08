import { Condition } from "@prisma/client";
import { ConditionCreationArgs, ConditionUpdateArgs } from "./types";
import { ApiError } from "next/dist/server/api-utils";
import { deleteEntity } from "./deletions";

export const createCondition = async (
    conditionCreationArgs: ConditionCreationArgs
): Promise<Condition> => {
    const endpoint = "/api/conditions/create";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(conditionCreationArgs),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const createConditions = async (
    conditionCreationArgsArray: ConditionCreationArgs[]
): Promise<Condition[]> => {
    if (
        !conditionCreationArgsArray ||
        conditionCreationArgsArray.length === 0
    ) {
        return [];
    }
    const endpoint = "/api/conditions/createMany";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            experimentId: conditionCreationArgsArray[0].experimentId,
            conditions: conditionCreationArgsArray,
        }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const fetchCondition = async (id: number): Promise<Condition> => {
    const endpoint = `/api/conditions/${id}`;
    const response = await fetch(endpoint);
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const updateCondition = async (
    conditionUpdateArgs: ConditionUpdateArgs
): Promise<Condition> => {
    const endpoint = `/api/conditions/${conditionUpdateArgs.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ name: conditionUpdateArgs.name }),
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

export const deleteCondition = async (
    id: number,
    confirm: boolean
): Promise<Condition> => {
    const endpoint = `/api/conditions/${id}/delete`;
    return deleteEntity(endpoint, confirm);
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
