import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { JSONToExperiment } from "./jsonConversions";
import {
    ExperimentInfo,
    ExperimentCreationArgs,
    ExperimentCreationResponse,
    ExperimentTable,
    ExperimentUpdateArgs,
} from "./types";
import { Experiment } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { encodePaging, relativeURL } from "./url";

export const fetchExperimentList = async (
    searchQuery: string,
    paging: ServerPaginationArgs
): Promise<ExperimentTable> => {
    const url = encodePaging(relativeURL("/api/experiments/search"), paging);
    url.searchParams.set("query", searchQuery);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        const table: ExperimentTable = resJson;
        return {
            ...table,
            // Convert the startDate from string to Date
            rows: table.rows.map((experiment) => ({
                ...experiment,
                startDate: new Date(experiment.startDate),
            })),
        };
    }
    throw new ApiError(response.status, resJson.message);
};

export const createExperiment = async (
    experimentData: ExperimentCreationArgs
): Promise<ExperimentCreationResponse> => {
    console.log("controller experimentData:", experimentData);
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
        return {
            experiment: JSONToExperiment(resJson.experiment),
            conditions: resJson.conditions,
        };
    }
    throw new ApiError(response.status, resJson.message);
};

export const fetchExperimentInfo = async (
    id: number
): Promise<ExperimentInfo> => {
    const endpoint = `/api/experiments/${id}/fetchExperimentInfo`;
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
            assays: resJson.assays,
            assayResults: resJson.assayResults,
        };
    }
    throw new ApiError(response.status, resJson.message);
};

export const hasRecordedAssayResults = async (id: number): Promise<Boolean> => {
    const endpoint = `/api/experiments/${id}/hasRecordedResults`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const deleteExperiment = async (id: number): Promise<Experiment> => {
    const endpoint = `/api/experiments/${id}/delete`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let resJson = await response.json();
    if (response.ok) {
        return JSONToExperiment(resJson);
    }
    throw new ApiError(response.status, resJson.message);
};

export const updateExperiment = async (
    experiment: ExperimentUpdateArgs
): Promise<Experiment> => {
    const endpoint = `/api/experiments/${experiment.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            title: experiment.title,
            description: experiment.description,
            startDate: experiment.startDate,
            ownerId: experiment.ownerId,
        }),
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
