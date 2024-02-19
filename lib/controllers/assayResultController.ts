import { deleteEntity } from "./deletions";
import { ApiError } from "next/dist/server/api-utils";
import { AssayResult } from "@prisma/client";
import { AssayResultCreationArgs, AssayResultUpdateArgs } from "./types";

export const createAssayResult = async (
    assayResultCreationArgs: AssayResultCreationArgs
) => {
    const endpoint = "/api/assayResults/create";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assayResultCreationArgs),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const updateAssayResult = async (
    assayResultUpdateArgs: AssayResultUpdateArgs
): Promise<AssayResult> => {
    const endpoint = `/api/assayResults/${assayResultUpdateArgs.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            result: assayResultUpdateArgs.result,
            comment: assayResultUpdateArgs.comment,
        }),
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

export const deleteAssayResult = async (id: number): Promise<AssayResult> => {
    const endpoint = `/api/assayResults/${id}/delete`;
    try {
        return deleteEntity(endpoint);
    } catch (error) {
        throw error;
    }
};
