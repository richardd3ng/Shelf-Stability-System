import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { AssayTable } from "./types";
import { Dayjs } from "dayjs";

export const fetchAgendaList = async (minDate: Dayjs | null, maxDate: Dayjs | null, includeRecorded: boolean, sortModel: GridSortModel, pagination: GridPaginationModel) : Promise<AssayTable> => {
    const url = new URL("/api/assays/agenda", typeof window !== "undefined" ? window.location.origin : undefined);
    if (sortModel.length > 0 && sortModel[0].sort !== null && sortModel[0].sort !== undefined) {
        url.searchParams.set("sort_by", sortModel[0].field);
        url.searchParams.set("sort_order", sortModel[0].sort);
    }
    url.searchParams.set("page", pagination.page.toString());
    url.searchParams.set("page_size", pagination.pageSize.toString());

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

    if (apiResponse.ok) {
        return await apiResponse.json()
            .then((data: AssayTable) =>
                ({
                    ...data,
                    // Convert the targetDate from string to Date
                    rows: data.rows.map(assay => ({...assay, targetDate: new Date(assay.targetDate)}))
                }));
    }
    throw new Error(apiResponse.status +": Failed to fetch assays");
}

export interface UpdateAssayResultArgs {
    experimentId : number;
    assayId : number;
    newResult : string;
}

export const updateAssayResultThroughAPI = async (assayInfo : UpdateAssayResultArgs) : Promise<UpdateAssayResultArgs> => {
    const apiResponse = await fetch("/api/assays/" + assayInfo.assayId.toString() + "/updateAssayResult", {
        method: "POST",
        body : JSON.stringify( {result : assayInfo.newResult}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return assayInfo;
}
