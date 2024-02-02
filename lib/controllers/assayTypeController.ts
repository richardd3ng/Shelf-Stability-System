import { AssayType } from "@prisma/client";
import { AssayTypeCreationData, AssayTypeResponse } from "./types";

// export const fetchAllAssayTypes = async (): Promise<AssayType[]> => {};

export const createAssayTypes = async (assayTypes: AssayTypeCreationData[]) => {
    const response = await fetch("/api/assayTypes/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            assayTypes: assayTypes,
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
    let resJson: AssayTypeResponse[] = await response.json();
    if (response.status < 300) {
        const distinctAssayTypes: string[] = resJson.map(
            (condition: AssayTypeResponse) => condition.name
        );
        return distinctAssayTypes;
    } else {
        throw new Error("Error: Failed to fetch distinct assay types");
    }
};
