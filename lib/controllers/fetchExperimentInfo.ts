import { AssayJSON, JSONToAssay, JSONToExperiment } from "./jsonConversions";
import { ExperimentInfo } from "./types";

export const fetchExperimentInfoThroughAPI = async (
    experimentId: number
): Promise<ExperimentInfo> => {
    const apiResponse = await fetch(
        "/api/experiments/" + experimentId.toString() + "/fetchExperimentInfo",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    let resJson = await apiResponse.json();
    if (apiResponse.status < 300) {
        return {
            experiment: JSONToExperiment(resJson.experiment),
            conditions: resJson.conditions,
            assayTypes: resJson.assayTypes,
            assays: resJson.assays.map((assay: AssayJSON) =>
                JSONToAssay(assay)
            ),
        };
    } else {
        throw new Error("An error occurred");
    }
};
