import { JSONToExperiment, ExperimentJSON } from "./jsonConversions";
import { ExperimentList } from "./types";

export const fetchExperimentList = async (): Promise<ExperimentList> => {
    const apiResponse = await fetch("/api/experiments/list", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let resJson = await apiResponse.json();
    if (apiResponse.status < 300) {
        return {
            experiments: resJson.map((experiment: ExperimentJSON) =>
                JSONToExperiment(experiment)
            ),
        };
    } else {
        throw new Error("An error occurred");
    }
};
