import { ApiError } from "next/dist/server/api-utils";
import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { encodePaging, relativeURL } from "./url";
import { deleteEntity } from "./deletions";
import { LocalDate } from "@js-joda/core";
import { Assay } from "@prisma/client";
import { AssayCreationArgs, AssayInfo, AssayTable, AssayUpdateArgs } from "./types";
import { stringFieldsToLocalDate } from "./jsonConversions";

export const fetchAgendaList = async (
    minDate: LocalDate | null,
    maxDate: LocalDate | null,
    includeRecorded: boolean,
    ownedAssaysOnly: boolean,
    paging: ServerPaginationArgs
): Promise<AssayTable> => {
    const url = encodePaging(relativeURL("/api/assays/agenda"), paging);

    url.searchParams.set("include_recorded", includeRecorded.toString());
    url.searchParams.set("owned_assays_only", ownedAssaysOnly.toString());
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
        const table: { rows: (Omit<AssayInfo, 'targetDate'> & { targetDate: string })[]; rowCount: number } = resJson;
        return {
            ...table,
            // Convert the startDate from string to Date
            rows: table.rows.map((assay) => stringFieldsToLocalDate(assay, ["targetDate"])),
        };
    }
    throw new ApiError(response.status, resJson.message);
};

export const fetchAssay = async (id: number): Promise<Assay> => {
    const endpoint = `/api/assays/${id}`;
    const response = await fetch(endpoint, {
        method: "GET",
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
