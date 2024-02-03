import { Assay } from "@prisma/client";
import { AssayCreationData } from "./types";

export const createAssays = async (assays: AssayCreationData[]) => {
    if (!assays || assays.length === 0) {
        return [];
    }
    const response = await fetch("/api/assays/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ assays }),
    });
    if (response.ok) {
        const resJson: Assay[] = await response.json();
        return resJson;
    } else {
        throw new Error("Error: Failed to create assays");
    }
};
