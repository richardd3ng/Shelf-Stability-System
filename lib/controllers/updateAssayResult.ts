import { ApiError } from "next/dist/server/api-utils";

export interface UpdateAssayResultArgs {
    experimentId: number;
    assayId: number;
    newResult: string;
}

export const updateAssayResultThroughAPI = async (
    assayInfo: UpdateAssayResultArgs
): Promise<UpdateAssayResultArgs> => {
    const endpoint = `/api/assays/${assayInfo.assayId.toString()} +  + /updateAssayResult`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ result: assayInfo.newResult }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return assayInfo;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};
