import { deleteEntity } from "./deletions";
import { ApiError } from "next/dist/server/api-utils";
import { AssayResult } from "@prisma/client";
import { AssayResultCreationArgs, AssayResultUpdateArgs } from "./types";

export const getAssayResult = async (id: number): Promise<AssayResult> => {
    const endpoint = `/api/assayResult/${id}`;
    const response = await fetch(endpoint);
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
}

export const createAssayResult = async (
    assayResultCreationArgs: AssayResultCreationArgs
) => {
    const endpoint = "/api/assayResult/create";
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
    const endpoint = `/api/assayResult/${assayResultUpdateArgs.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            result: assayResultUpdateArgs.result,
            comment: assayResultUpdateArgs.comment,
            author: assayResultUpdateArgs.author,
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
    const endpoint = `/api/assayResult/${id}/delete`;
    try {
        return deleteEntity(endpoint);
    } catch (error) {
        throw error;
    }
};

export const fetchResultForAssay = async (assayId: number): Promise<AssayResult | null> => {
    const endpoint = `/api/assays/${assayId}/result`;
    const response = await fetch(endpoint);
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};
