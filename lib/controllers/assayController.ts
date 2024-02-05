import { Assay } from "@prisma/client";
import { AssayCreationArgs } from "./types";
import { ApiError } from "next/dist/server/api-utils";

export const createAssays = async (assays: AssayCreationArgs[]) => {
    if (!assays || assays.length === 0) {
        return [];
    }
    const response = await fetch("/api/assays/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ assays: assays }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};