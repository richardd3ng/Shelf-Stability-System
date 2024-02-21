import { ApiError } from "next/dist/server/api-utils";
import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { encodePaging, relativeURL } from "./url";
import { deleteEntity } from "./deletions";
import { LocalDate } from "@js-joda/core";
import { Assay } from "@prisma/client";
import { AssayCreationArgs, AssayTable, AssayUpdateArgs } from "./types";

export const fetchAgendaList = async (
    minDate: LocalDate | null,
    maxDate: LocalDate | null,
    includeRecorded: boolean,
    paging: ServerPaginationArgs
): Promise<AssayTable> => {
    const url = encodePaging(relativeURL("/api/assays/agenda"), paging);

    url.searchParams.set("include_recorded", includeRecorded.toString());
    if (minDate !== null) {
        url.searchParams.set("minDate", minDate.toString());
    }
    if (maxDate !== null) {
        url.searchParams.set("maxDate", maxDate.toString());
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const resJson = await response.json();
    if (response.ok) {
        const table: AssayTable = resJson;
        return {
            ...table,
            // Convert the targetDate from string to Date
            rows: table.rows.map((assay) => ({
                ...assay,
                targetDate: new Date(assay.targetDate),
            })),
        };
    }
    throw new ApiError(response.status, resJson.message);
};

export const createAssay = async (assayCreationArgs: AssayCreationArgs) => {
    const endpoint = "/api/assays/create";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assayCreationArgs),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    }
    throw new ApiError(response.status, resJson.message);
};

export const deleteAssay = async (id: number): Promise<Assay> => {
    const endpoint = `/api/assays/${id}/delete`;
    try {
        return deleteEntity(endpoint);
    } catch (error) {
        throw error;
    }
};

export const updateAssay = async (
    assayInfo: AssayUpdateArgs
): Promise<Assay> => {
    const endpoint = `/api/assays/${assayInfo.id}/update`;
    const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            conditionId: assayInfo.conditionId,
            type: assayInfo.type,
            week: assayInfo.week,
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
