import {
    AssayJSON,
    JSONToAssay,
    JSONToExperiment,
    ExperimentJSON,
} from "./jsonConversions";
import { ExperimentInfo, ExperimentList } from "./types";

export const fetchExperimentList = async (): Promise<ExperimentList> => {
    let endpoint = "/api/experiments/list";
    const apiResponse = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.ok) {
        const resJson = await apiResponse.json();
        return {
            experiments: resJson.map((experiment: ExperimentJSON) =>
                JSONToExperiment(experiment)
            ),
        };
    } else {
        throw new Error("An error occurred");
    }
};

export const queryExperimentList = async (
    query: string
): Promise<ExperimentList> => {
    console.log("controller query: ", query);
    const endpoint = `/api/experiments/search?query=${encodeURIComponent(
        query
    )}`;
    const apiResponse = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.ok) {
        const resJson = await apiResponse.json();
        console.log("API response: ", resJson);
        return {
            experiments: resJson.map((experiment: ExperimentJSON) =>
                JSONToExperiment(experiment)
            ),
        };
    } else {
        throw new Error("An error occurred");
    }
};

export const fetchExperimentInfo = async (
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
