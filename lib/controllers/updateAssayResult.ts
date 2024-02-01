export interface UpdateAssayResultArgs {
    experimentId : number;
    assayId : number;
    newResult : string;
}

export const updateAssayResultThroughAPI = async (assayInfo : UpdateAssayResultArgs) : Promise<UpdateAssayResultArgs> => {
    const apiResponse = await fetch("/api/assays/" + assayInfo.assayId.toString() + "/updateAssayResult", {
        method: "POST",
        body : JSON.stringify( {result : assayInfo.newResult}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return assayInfo;
}