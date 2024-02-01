import {
    AssayJSON,
    JSONToAssay,
    JSONToExperiment,
    ExperimentJSON,
} from "./jsonConversions";
import { ExperimentInfo, ExperimentList, ExperimentCreationData } from "./types";
import { AssayType } from "@prisma/client";

export const fetchExperimentList = async (): Promise<ExperimentList> => {
    let endpoint = "/api/experiments/list";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const resJson = await response.json();
        return {
            experiments: resJson.map((experiment: ExperimentJSON) =>
                JSONToExperiment(experiment)
            ),
        };
    } else {
        throw new Error("Error: Failed to fetch experiment list");
    }
};

export const queryExperimentList = async (
    query: string
): Promise<ExperimentList> => {
    const endpoint = `/api/experiments/search?query=${encodeURIComponent(
        query
    )}`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const resJson = await response.json();
        return {
            experiments: resJson.map((experiment: ExperimentJSON) =>
                JSONToExperiment(experiment)
            ),
        };
    } else {
        throw new Error("Error: Failed to query experiment list");
    }
};

export const fetchExperimentInfo = async (
    experimentId: number
): Promise<ExperimentInfo> => {
    const response = await fetch(
        "/api/experiments/" + experimentId.toString() + "/fetchExperimentInfo",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    let resJson = await response.json();
    if (response.status < 300) {
        return {
            experiment: JSONToExperiment(resJson.experiment),
            conditions: resJson.conditions,
            assayTypes: resJson.assayTypes,
            assays: resJson.assays.map((assay: AssayJSON) =>
                JSONToAssay(assay)
            ),
        };
    } else {
        throw new Error("Error: Failed to fetch experiment info");
    }
};

export const createExperiment = async (experimentData: ExperimentCreationData) => {
    const response = await fetch("/api/experiments/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(experimentData),
    });

    if (response.ok) {
        const resJson = await response.json();
        console.log("created experiment resJson: ", resJson);
        return resJson;
    } else {
        if (response.status === 400) {
            const resJson = await response.json();
            const errorMessage =
                resJson.error || "Bad request. Please check the provided data.";
            throw new Error(`Error: ${errorMessage}`);
        } else {
            throw new Error("Error: Failed to create experiment");
        }
    }
};

export const deleteExperiment = async (experimentId: number) => {};
