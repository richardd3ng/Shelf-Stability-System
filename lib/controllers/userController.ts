import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { AssayTable, UserTable } from "./types";
import { encodePaging, relativeURL } from "./url";

export const fetchUsers = async (paging: ServerPaginationArgs): Promise<UserTable> => {
    const url = encodePaging(relativeURL("/api/assays/agenda"), paging);

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