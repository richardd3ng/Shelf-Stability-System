import { AssayCreationData } from "./types";

export const createAssays = async (assays: AssayCreationData[]) => {
    const response = await fetch("/api/assays/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ assays }),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error: Failed to create assays");
    }
};
