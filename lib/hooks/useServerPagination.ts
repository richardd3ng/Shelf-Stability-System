import { DataGridProps, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export type ServerPaginationProps = Partial<DataGridProps>
export type ServerPaginationArgs = {
    sortModel: GridSortModel;
    pagination: GridPaginationModel;
}

export function useServerPagination(reload: (paging: ServerPaginationArgs) => Promise<{ rowCount: number }>, defaultSort: GridSortModel, defaultPagination: GridPaginationModel)
    : [ServerPaginationProps, () => void] {
    const [sortModel, setSortModel] = useState<GridSortModel>(defaultSort);
    const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
    const [rowCount, setRowCount] = useState<number>(0);

    const paginationArgs = { sortModel, pagination };

    const newReload = async () => {
        reload(paginationArgs)
            .then((result) => setRowCount(result.rowCount));
    };

    useEffect(() => {
        newReload();
    }, [pagination]);

    useEffect(() => {
        // When sorting changes, only reload if paging is happening
        if (rowCount > pagination.pageSize) {
            newReload();
        }
    }, [sortModel]);

    return [
        {
            rowCount,
            sortModel,
            onSortModelChange: setSortModel,
            pagination: true,
            paginationMode: 'server',
            paginationModel: pagination,
            onPaginationModelChange: setPagination,
        },
        newReload
    ];
}