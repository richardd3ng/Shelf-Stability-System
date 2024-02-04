import { AssayType } from "@prisma/client";
import { AssayTypeCreationArgs, AssayTypeNamesResponse } from "./types";
import { ApiError } from "next/dist/server/api-utils";

export const createAssayTypes = async (
    assayTypes: AssayTypeCreationArgs[]
): Promise<AssayType[]> => {
    if (!assayTypes || assayTypes.length === 0) {
        return [];
    }
    const endpoint = "/api/assayTypes/createMany";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            experimentId: assayTypes[0].experimentId,
            assayTypes: assayTypes,
        }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const fetchDistinctAssayTypes = async (): Promise<string[]> => {
    const endpoint = "/api/assayTypes/fetchDistinct";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        const distinctAssayTypes: string[] = resJson.map(
            (condition: AssayTypeNamesResponse) => condition.name
        );
        return distinctAssayTypes;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};
