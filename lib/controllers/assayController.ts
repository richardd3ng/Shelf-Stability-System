import { AssayCreationArgs } from "./types";
import { AssayTable } from "./types";
import { ApiError } from "next/dist/server/api-utils";
import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { encodePaging, relativeURL } from "./url";
import { deleteEntity } from "./deletions";
import { LocalDate } from "@js-joda/core";

export const fetchAgendaList = async (minDate: LocalDate | null, maxDate: LocalDate | null, includeRecorded: boolean, paging: ServerPaginationArgs): Promise<AssayTable> => {
    const url = encodePaging(relativeURL("/api/assays/agenda"), paging);

    url.searchParams.set("include_recorded", includeRecorded.toString());
    if (minDate !== null) {
        url.searchParams.set("minDate", minDate.toString());
    }
    if (maxDate !== null) {
        url.searchParams.set("maxDate", maxDate.toString());
    }

    const apiResponse = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const resJson = await apiResponse.json();
    if (apiResponse.ok) {
        const table: AssayTable = resJson;
        return {
            ...table,
            // Convert the targetDate from string to Date
            rows: table.rows.map(assay =>
            ({
                ...assay,
                targetDate: new Date(assay.targetDate)
            }))
        }
    }

    throw new ApiError(apiResponse.status, resJson.message);
}

export const createAssays = async (assays: AssayCreationArgs[]) => {
    if (!assays || assays.length === 0) {
        return [];
    }
    const response = await fetch("/api/assays/createMany", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ assays: assays }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export interface UpdateAssayResultArgs {
    assayId: number;
    newResult: string | null;
}

export const updateAssayResultThroughAPI = async (
    assayInfo: UpdateAssayResultArgs
): Promise<UpdateAssayResultArgs> => {
    console.log(assayInfo.assayId);
    console.log(assayInfo.assayId.toString());
    const endpoint = `/api/assays/${assayInfo.assayId}/updateAssayResult`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ result: assayInfo.newResult }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return assayInfo;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

export const deleteAssayThroughAPI = async (assayId : number) : Promise<number> => {
    await deleteEntity(`/api/assays/${assayId}/deleteAssay`);
    return assayId;
}

export const deleteAssayResultThroughAPI = async (assayId : number) : Promise<number> => {
    await deleteEntity(`/api/assays/${assayId}/deleteAssayResult`);
    return assayId;
}

export interface UpdateAssayArgs {
    assayId : number;
    newResult : string | null;
    newTargetDate : Date;
    shouldUpdateTargetDate : boolean;

}
export const updateAssayThroughAPI = async (assayInfo : UpdateAssayArgs) : Promise<UpdateAssayArgs> => {
    const apiResponse = await fetch("/api/assays/" + assayInfo.assayId.toString() + "/updateAssay", {
        method: "POST",
        body : JSON.stringify( {
            result : assayInfo.newResult,
            targetDate : assayInfo.newTargetDate,
            shouldUpdateTargetDate : assayInfo.shouldUpdateTargetDate
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return assayInfo;
}