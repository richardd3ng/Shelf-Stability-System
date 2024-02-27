import { ServerPaginationArgs } from "../hooks/useServerPagination";

export function relativeURL(url: string): URL {
    return new URL(
        url,
        typeof window !== "undefined" ? window.location.origin : undefined
    );
}

export function encodePaging(url: URL, paging?: ServerPaginationArgs): URL {
    if (!paging) {
        return url;
    }
    // Assume only one field is sorted by at a time
    if (
        paging.sortModel !== undefined &&
        paging.sortModel.length > 0 &&
        paging.sortModel[0].sort !== null &&
        paging.sortModel[0].sort !== undefined
    ) {
        url.searchParams.set("sort_by", paging.sortModel[0].field);
        url.searchParams.set("sort_order", paging.sortModel[0].sort);
    }
    url.searchParams.set("page", paging.pagination.page.toString());
    url.searchParams.set("page_size", paging.pagination.pageSize.toString());
    return url;
}
