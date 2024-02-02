import { AssayType } from "@prisma/client";
import { AssayTypeCreationData, AssayTypeNamesResponse } from "./types";

export const createAssayTypes = async (
    assayTypes: AssayTypeCreationData[]
): Promise<AssayType[]> => {
    if (!assayTypes || assayTypes.length === 0) {
        return [];
    }
    const response = await fetch("/api/assayTypes/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            experimentId: assayTypes[0].experimentId,
            assayTypes: assayTypes,
        }),
    });
    if (response.ok) {
        const resJson: AssayType[] = await response.json();
        return resJson;
    } else {
        if (response.status === 400) {
            const resJson = await response.json();
            const errorMessage =
                resJson.error || "Bad request. Please check the provided data.";
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to create assay types");
        }
    }
};

export const fetchDistinctAssayTypes = async (): Promise<string[]> => {
    const response = await fetch("/api/assayTypes/fetchDistinct", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson: AssayTypeNamesResponse[] = await response.json();
    if (response.status < 300) {
        const distinctAssayTypes: string[] = resJson.map(
            (condition: AssayTypeNamesResponse) => condition.name
        );
        return distinctAssayTypes;
    } else {
        throw new Error("Error: Failed to fetch distinct assay types");
    }
};
