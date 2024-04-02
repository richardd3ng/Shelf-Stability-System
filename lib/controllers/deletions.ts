import { ApiError } from "next/dist/server/api-utils";
import { relativeURL } from "./url";

export const deleteEntity = async (
    endpoint: string,
    confirm?: boolean
): Promise<any> => {
    const url = relativeURL(endpoint);
    if (confirm !== undefined) {
        url.searchParams.append("confirm", confirm.toString());
    }
    const response = await fetch(url.toString(), {
        method: "GET",
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
