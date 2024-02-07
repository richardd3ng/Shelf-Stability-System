import { AssayCreationArgs } from "./types";
import { AssayTable } from "./types";
import { ApiError } from "next/dist/server/api-utils";
import { Dayjs } from "dayjs";
import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { encodePaging, relativeURL } from "./url";

export const fetchAgendaList = async (minDate: Dayjs | null, maxDate: Dayjs | null, includeRecorded: boolean, paging: ServerPaginationArgs): Promise<AssayTable> => {
    const url = encodePaging(relativeURL("/api/assays/agenda"), paging);

    url.searchParams.set("include_recorded", includeRecorded.toString());
    if (minDate !== null) {
        url.searchParams.set("minDate", minDate.format('YYYY-MM-DD'));
    }
    if (maxDate !== null) {
        url.searchParams.set("maxDate", maxDate.format('YYYY-MM-DD'));
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
    experimentId: number;
    assayId: number;
    newResult: string;
}

export const updateAssayResultThroughAPI = async (
    assayInfo: UpdateAssayResultArgs
): Promise<UpdateAssayResultArgs> => {
    const endpoint = `/api/assays/${assayInfo.assayId.toString()} +  + /updateAssayResult`;
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