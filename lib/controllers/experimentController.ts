import {
    AssayJSON,
    JSONToAssay,
    JSONToExperiment,
    ExperimentJSON,
} from "./jsonConversions";
import { ExperimentInfo, ExperimentCreationArgs } from "./types";
import { Experiment } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";

export const fetchExperimentList = async (): Promise<Experiment[]> => {
    const endpoint = "/api/experiments/list";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson.map((experiment: ExperimentJSON) =>
            JSONToExperiment(experiment)
        );
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const queryExperimentList = async (
    query: string
): Promise<Experiment[]> => {
    const endpoint = `/api/experiments/search?query=${encodeURIComponent(
        query
    )}`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.status < 300) {
        return resJson.map((experiment: ExperimentJSON) =>
            JSONToExperiment(experiment)
        );
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const createExperiment = async (
    experimentData: ExperimentCreationArgs
): Promise<Experiment> => {
    const endpoint = "/api/experiments/create";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(experimentData),
    });
    const resJson = await response.json();
    if (response.ok) {
        return JSONToExperiment(resJson);
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const fetchExperimentInfo = async (
    experimentId: number
): Promise<ExperimentInfo> => {
    const endpoint = `/api/experiments/${experimentId.toString()}/fetchExperimentInfo`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let resJson = await response.json();
    if (response.ok) {
        return {
            experiment: JSONToExperiment(resJson.experiment),
            conditions: resJson.conditions,
            assayTypes: resJson.assayTypes,
            assays: resJson.assays.map((assay: AssayJSON) =>
                JSONToAssay(assay)
            ),
        };
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const hasRecordedAssayResults = async (
    experimentId: number
): Promise<Boolean> => {
    const endpoint = `/api/experiments/${experimentId.toString()}/hasRecordedResults`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const deleteExperiment = async (
    experimentId: number
): Promise<Experiment> => {
    const endpoint = `/api/experiments/${experimentId.toString()}/delete`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let resJson = await response.json();
    if (response.ok) {
        return JSONToExperiment(resJson);
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};
