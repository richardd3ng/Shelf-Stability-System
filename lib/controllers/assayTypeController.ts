import { AssayType } from "@prisma/client";
import { AssayTypeCreationArgs, AssayTypeNamesResponse } from "./types";
import { ApiError } from "next/dist/server/api-utils";
import { deleteEntity } from "./deletions";

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

interface UpdateAssayTypeArgs {
    assayTypeId : number;
    newName : string;
}
export const updateAssayTypeThroughAPI = async (assayTypeInfo : UpdateAssayTypeArgs) : Promise<UpdateAssayTypeArgs> => {
    const apiResponse = await fetch("/api/assayTypes/" + assayTypeInfo.assayTypeId.toString() + "/updateAssayType", {
        method: "POST",
        body : JSON.stringify( {name : assayTypeInfo.newName}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return assayTypeInfo;
}

export const deleteAssayType = async (assayTypeId : number) => {
    await deleteEntity("/api/assayTypes/" + assayTypeId.toString() + "/deleteAssayType");
}