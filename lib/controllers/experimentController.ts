import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { AssayJSON, JSONToAssay, JSONToExperiment } from "./jsonConversions";
import {
    ExperimentInfo,
    ExperimentCreationArgs,
    ExperimentCreationResponse,
    ExperimentTable,
    ExperimentData
} from "./types";
import { ApiError } from "next/dist/server/api-utils";
import { encodePaging, relativeURL } from "./url";
import { LocalDate } from "@js-joda/core";

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
        const table: { rows: any[], rowCount: number } = resJson;
        return {
            ...table,
            // Convert the startDate from string to Date
            rows: table.rows.map((experiment) => ({
                ...experiment,
                startDate: LocalDate.parse(experiment.startDate),
            }))
        }
    }

    throw new ApiError(response.status, resJson.message);
};

export const createExperiment = async (
    experimentData: ExperimentCreationArgs
): Promise<ExperimentCreationResponse> => {
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
): Promise<ExperimentData> => {
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

export interface UpdateExperimentArgs {
    experimentId: number;
    newTitle: string;
    newDescription: string | null;
    newStartDate: LocalDate | null;
    shouldUpdateStartDate: boolean;
}

export const TITLE_IS_TAKEN_CODE = 400;
export const updateExperimentThroughAPI = async (
    experimentInfo: UpdateExperimentArgs
): Promise<UpdateExperimentArgs> => {
    const apiResponse = await fetch(
        "/api/experiments/" +
            experimentInfo.experimentId.toString() +
            "/updateExperiment",
        {
            method: "POST",
            body: JSON.stringify({
                title: experimentInfo.newTitle,
                description: experimentInfo.newDescription,
                startDate: experimentInfo.newStartDate,
                shouldUpdateStartDate: experimentInfo.shouldUpdateStartDate,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    
    if (apiResponse.status > 300) {
        // Note: this is broken, should use some other error code, maybe in the API response
        if (apiResponse.status === TITLE_IS_TAKEN_CODE) {
            throw new Error("Title is taken already, pick another");
        } else {
            throw new Error("An error occurred");
        }
    }
    return experimentInfo;
};
