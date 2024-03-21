import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { JSONToExperiment } from "./jsonConversions";
import {
    ExperimentInfo,
    ExperimentCreationArgs,
    ExperimentCreationResponse,
    ExperimentTable,
    ExperimentUpdateArgs,
    ExperimentWithLocalDate,
    ExperimentOwner,
} from "./types";
import { ApiError } from "next/dist/server/api-utils";
import { encodePaging, relativeURL } from "./url";
import { LocalDate } from "@js-joda/core";

export const fetchExperimentList = async (
    searchQuery: string,
    ownerFilter: string,
    paging: ServerPaginationArgs
): Promise<ExperimentTable> => {
    const url = encodePaging(relativeURL("/api/experiments/search"), paging);
    url.searchParams.set("query", searchQuery);
    url.searchParams.set("owner", ownerFilter);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        const table: { rows: any[]; rowCount: number } = resJson;
        return {
            ...table,
            // Convert the startDate from string to Date
            rows: table.rows.map((experiment) => ({
                ...experiment,
                startDate: LocalDate.parse(experiment.startDate),
            })),
        };
    }
    throw new ApiError(response.status, resJson.message);
};

export const fetchOwnedExperiments = async (
    ownerId: number
): Promise<ExperimentWithLocalDate[] | ApiError> => {
    const endpoint = `/api/experiments/with-owner?id=${ownerId}`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson.map(JSONToExperiment);
    }
    return new ApiError(response.status, resJson.message);
};

export const createExperiment = async (
    experimentCreationArgs: ExperimentCreationArgs
): Promise<ExperimentCreationResponse> => {
    const endpoint = "/api/experiments/create";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(experimentCreationArgs),
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
            assayTypes : resJson.assayTypes
        };
    }
    throw new ApiError(response.status, resJson.message);
};

export const fetchExperimentOwner = async (
    id: number
): Promise<ExperimentOwner> => {
    const endpoint = `/api/experiments/${id}/fetchExperimentOwner`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let resJson = await response.json();
    if (response.ok) {
        return {
            username: resJson.username,
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

export const deleteExperiment = async (
    id: number
): Promise<ExperimentWithLocalDate> => {
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
    experimentUpdateArgs: ExperimentUpdateArgs
): Promise<ExperimentWithLocalDate> => {
    const endpoint = `/api/experiments/${experimentUpdateArgs.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(experimentUpdateArgs),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return JSONToExperiment(resJson);
    }
    throw new ApiError(response.status, resJson.message);
};
