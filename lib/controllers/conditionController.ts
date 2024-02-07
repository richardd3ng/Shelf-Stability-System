import { Condition } from "@prisma/client";
import { ConditionCreationArgs, ConditionNamesResponse } from "./types";
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

interface UpdateConditionArgs {
    conditionId : number;
    newName : string;
}
export const updateConditionThroughAPI = async (conditionInfo : UpdateConditionArgs) : Promise<UpdateConditionArgs> => {
    const apiResponse = await fetch("/api/conditions/" + conditionInfo.conditionId.toString() + "/updateCondition", {
        method: "POST",
        body : JSON.stringify( {name : conditionInfo.newName}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return conditionInfo;
}

interface MakeConditionTheControlArgs {
    conditionId : number;
}
export const makeConditionTheControlThroughAPI = async (conditionInfo : MakeConditionTheControlArgs) : Promise<MakeConditionTheControlArgs> => {
    const apiResponse = await fetch("/api/conditions/" + conditionInfo.conditionId.toString() + "/makeTheControl", {
        method: "POST",
        body : JSON.stringify({}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return conditionInfo;
}


export const deleteCondition = async (conditionId : number) => {
    await deleteEntity("/api/conditions/" + conditionId.toString() + "/deleteCondition");
}
