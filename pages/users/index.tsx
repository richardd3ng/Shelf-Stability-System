import { UserInfo, UserTable } from "@/lib/controllers/types";
import { ServerPaginationArgs, useServerPaginationNoSort } from "@/lib/hooks/useServerPagination";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

const colDefs: GridColDef[] = [
    {
        field: "isAdmin",
        headerName: "",
        type: "boolean",
        flex: 1,
        sortable: false,
    },
    {
        field: "username",
        headerName: "Username",
        type: "string",
        flex: 2,
        sortable: false,
    },
];

export function Users() {
    const [rows, setRows] = useState<UserInfo[]>([]);

    function reloadUsers(paging: ServerPaginationArgs) {
        return fetchUserList(
            paging
        ).then((res: UserTable) => {
            setRows(res.rows);
            return res;
        });
    }

    const [paginationProps, reload] = useServerPaginationNoSort(
        reloadUsers,
        {
            pageSize: 15,
            page: 0
        });

    return (
        <DataGrid
            rows={rows}
            columns={colDefs}
            {...paginationProps}
            rowSelection={false}
            autoHeight
            rowHeight={43}
            pageSizeOptions={[15, 30, 60, 100]}
            getCellClassName={(params) =>
                params.row.result !== null
                    ? "user-cell-admin"
                    : "user-cell-not-admin"
            }
            disableColumnMenu
        />
    );
}