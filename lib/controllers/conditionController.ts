import { ConditionCreationData, ConditionResponse } from "./types";

export const createConditions = async (conditions: ConditionCreationData[]) => {
    const response = await fetch("/api/conditions/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            conditions: conditions,
        }),
    });

    if (response.ok) {
        const resJson = await response.json();
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
    let resJson: ConditionResponse[] = await response.json();
    if (response.status < 300) {
        const distinctConditions: string[] = resJson.map(
            (condition: ConditionResponse) => condition.name
        );
        return distinctConditions;
    } else {
        throw new Error("Error: Failed to fetch distinct conditions");
    }
};
