import Layout from "@/components/shared/layout";
import { LoadingCircle } from "@/components/shared/loading";
import UserListOptions from "@/components/users/listOptions";
import { UserListContext } from "@/lib/context/users/userListContext";
import { UserInfo } from "@/lib/controllers/types";
import { fetchUserList } from "@/lib/controllers/userController";
import { ServerPaginationArgs, useServerPaginationNoSort } from "@/lib/hooks/useServerPagination";
import { Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const colDefs: GridColDef[] = [
    {
        field: "is_admin",
        headerName: "Role",
        type: "boolean",
        sortable: false,
        width: 100,
        renderCell: (params) => (params.value === true ? "Admin" : ""),
    },
    {
        field: "username",
        headerName: "Username",
        type: "string",
        sortable: false,
        flex: 1
    },
];

export default function Users() {
    const [rows, setRows] = useState<UserInfo[] | undefined>(undefined);
    const [query, setQuery] = useState<string>("");
    const router = useRouter();

    async function reloadUsers(paging: ServerPaginationArgs) {
        const res = await fetchUserList(query, paging);
        setRows(res.rows);
        return res;
    }

    const [paginationProps, reload] = useServerPaginationNoSort(
        reloadUsers,
        {
            pageSize: 15,
            page: 0
        });

    useEffect(() => {
        reload();
    }, [query]);

    function onRowClick(params: any) {
        router.push(`/users/${params.row.id}`);
    }

    return (
        <Layout>
            <UserListContext.Provider value={{ reload, query, setQuery }}>
                <Stack spacing={2}>
                    <UserListOptions />
                    {rows === undefined
                        ? <LoadingCircle />
                        : <DataGrid
                            rows={rows}
                            columns={colDefs}
                            {...paginationProps}
                            rowSelection={false}
                            autoHeight
                            rowHeight={43}
                            pageSizeOptions={[15, 30, 60, 100]}
                            getCellClassName={(params) =>
                                params.row.is_admin
                                    ? "user-cell-admin"
                                    : "user-cell-not-admin"
                            }
                            disableColumnMenu
                            onRowClick={onRowClick}
                            getRowClassName={(_) => "user-row-clickable"}
                        />
                    }
                </Stack>
            </UserListContext.Provider>
        </Layout>
    );
}