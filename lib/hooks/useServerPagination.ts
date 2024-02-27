import {
    DataGridProps,
    GridPaginationModel,
    GridSortModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export type ServerPaginationProps = Partial<DataGridProps>;
export type ServerPaginationArgs = {
    sortModel?: GridSortModel;
    pagination?: GridPaginationModel;
};

export function useServerPaginationNoSort(
    reload: (paging: ServerPaginationArgs) => Promise<{ rowCount: number }>,
    defaultPagination: GridPaginationModel
): [ServerPaginationProps, () => void] {
    const [pagination, setPagination] =
        useState<GridPaginationModel>(defaultPagination);

    return usePaginationHelper(reload, { pagination }, [
        pagination,
        setPagination,
    ]);
}

export function useServerPagination(
    reload: (paging: ServerPaginationArgs) => Promise<{ rowCount: number }>,
    defaultSort: GridSortModel,
    defaultPagination: GridPaginationModel
): [ServerPaginationProps, () => void] {
    const [sortModel, setSortModel] = useState<GridSortModel>(defaultSort);
    const [pagination, setPagination] =
        useState<GridPaginationModel>(defaultPagination);

    const paginationArgs = { sortModel, pagination };

    const [props, newReload] = usePaginationHelper(reload, paginationArgs, [
        pagination,
        setPagination,
    ]);

    useEffect(() => {
        // When sorting changes, only reload if paging is happening
        if (props.rowCount! > pagination.pageSize) {
            newReload();
        }
    }, [sortModel]);

    return [
        {
            ...props,
            sortModel,
            onSortModelChange: setSortModel,
        },
        newReload,
    ];
}

function usePaginationHelper(
    reload: (paging: ServerPaginationArgs) => Promise<{ rowCount: number }>,
    reloadArgs: ServerPaginationArgs,
    [pagination, setPagination]: [
        GridPaginationModel,
        (model: GridPaginationModel) => void
    ]
): [ServerPaginationProps, () => void] {
    const [rowCount, setRowCount] = useState<number>(0);

    const newReload = async () => {
        // Check if page size is -1, if so, remove pagination
        if ((reloadArgs.pagination?.pageSize ?? -1) < 0) {
            reloadArgs.pagination = undefined;
        }
        reload(reloadArgs).then((result) => setRowCount(result.rowCount));
    };

    useEffect(() => {
        newReload();
    }, [pagination]);

    return [
        {
            rowCount,
            pagination: true,
            paginationMode: "server",
            paginationModel: pagination,
            onPaginationModelChange: setPagination,
        },
        newReload,
    ];
}
