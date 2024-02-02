import { Condition } from "@prisma/client";
import { ConditionCreationData, ConditionNamesResponse } from "./types";

export const createConditions = async (
    conditions: ConditionCreationData[]
): Promise<Condition[]> => {
    if (!conditions || conditions.length === 0) {
        return [];
    }
    const response = await fetch("/api/conditions/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            experimentId: conditions[0].experimentId,
            conditions: conditions,
        }),
    });
    if (response.ok) {
        const resJson: Condition[] = await response.json();
        return resJson;
    } else {
        if (response.status === 400) {
            const resJson = await response.json();
            const errorMessage =
                resJson.error || "Bad request. Please check the provided data.";
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to create conditions");
        }
    }
};

export const fetchDistinctConditions = async (): Promise<string[]> => {
    const response = await fetch("/api/conditions/fetchDistinct", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson: ConditionNamesResponse[] = await response.json();
    if (response.status < 300) {
        const distinctConditions: string[] = resJson.map(
            (condition: ConditionNamesResponse) => condition.name
        );
        return distinctConditions;
    } else {
        throw new Error("Error: Failed to fetch distinct conditions");
    }
};
