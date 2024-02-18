import { deleteEntity } from "./deletions";
import { ApiError } from "next/dist/server/api-utils";
import { AssayResult } from "@prisma/client";
import { AssayResultUpdateArgs } from "./types";

export const deleteAssayResult = async (id: number): Promise<number> => {
    const endpoint = `/api/assayResults/${id}/delete`;
    try {
        await deleteEntity(endpoint);
        return id;
    } catch (error) {
        throw error;
    }
};

export const updateAssayResult = async (
    assayResult: AssayResultUpdateArgs
): Promise<AssayResult> => {
    const endpoint = `/api/assayResults/${assayResult.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            result: assayResult.result,
            comment: assayResult.comment,
            last_editor: assayResult.last_editor,
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
