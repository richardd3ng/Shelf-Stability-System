import Layout from "@/components/shared/layout";
import UserListOptions from "@/components/users/listOptions";
import { UserListContext } from "@/lib/context/users/userListContext";
import { UserInfo } from "@/lib/controllers/types";
import { fetchUserList } from "@/lib/controllers/userController";
import { ServerPaginationArgs, useServerPaginationNoSort } from "@/lib/hooks/useServerPagination";
import { requiresAdminProps } from "@/lib/serverProps";
import { Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { useLoading } from "@/lib/context/shared/loadingContext";

const colDefs: GridColDef[] = [
    {
        field: "is_admin",
        headerName: "Role",
        type: "boolean",
        sortable: false,
        width: 100,
        renderCell: (params) => (params.value === true ? <><Image src="/crown.png" width={35} height={35} alt="Crown indicating an admin" /> Admin</> : ''),
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
    const [rows, setRows] = useState<UserInfo[]>([]);
    const [query, setQuery] = useState<string>("");
    const router = useRouter();
    const { showLoading, hideLoading } = useLoading();

    async function reloadUsers(paging: ServerPaginationArgs) {
        const res = await fetchUserList(query, paging);
        setRows(res.rows);
        hideLoading();
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

    useEffect(() => {
        showLoading("Loading users...");
    }, []);

    function onRowClick(params: any) {
        router.push(`/users/${params.row.id}`);
    }

    return (
        <Layout>
            <UserListContext.Provider value={{ reload, query, setQuery }}>
                <Stack spacing={2}>
                    <UserListOptions />
                    <DataGrid
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
                </Stack>
            </UserListContext.Provider>
        </Layout>
    );
}

export const getServerSideProps = requiresAdminProps;
