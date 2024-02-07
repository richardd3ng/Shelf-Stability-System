import { ServerPaginationArgs } from "../hooks/useServerPagination";
import {
    AssayJSON,
    JSONToAssay,
    JSONToExperiment
} from "./jsonConversions";
import { ExperimentInfo, ExperimentCreationArgs, ExperimentTable } from "./types";
import { Experiment } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { encodePaging, relativeURL } from "./url";

export const fetchExperimentList = async (searchQuery: string, paging: ServerPaginationArgs): Promise<ExperimentTable> => {
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
            rows: table.rows.map(experiment => ({
                ...experiment,
                startDate: new Date(experiment.startDate),
            }))
        }
    }

    throw new ApiError(response.status, resJson.message);
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
