import Layout from "@/components/shared/layout";
import { fetchAgendaList } from "@/lib/controllers/assayController";
import { AssayInfo, AssayTable } from "@/lib/controllers/types";
import { Box, Stack, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import {
    DataGrid,
    GridColDef
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useServerPagination, ServerPaginationArgs } from "@/lib/hooks/useServerPagination";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";
import { AssayOptionsBox } from "@/components/agenda/assayOptionsBox";
import { AssayResultEditorOnAgenda } from "@/components/agenda/assayResultEditorOnAgenda";

const colDefs: GridColDef[] = [
    {
        field: "targetDate",
        headerName: "Target Date",
        type: "date",
        flex: 2,
    },
    {
        field: "title",
        headerName: "Title",
        type: "string",
        flex: 4,
    },
    {
        field: "condition",
        headerName: "Condition",
        type: "string",
        flex: 2,
    },
    {
        field: "week",
        headerName: "Week",
        type: "number",
        flex: 1,
    },
    {
        field: "type",
        headerName: "Assay Type",
        type: "string",
        flex: 2,
    },
    {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        align: "center",
        headerAlign: "center",
        disableColumnMenu: true,
        sortable: false,
        renderCell: params => (
            <AssayOptionsBox assayId={params.row.id} experimentId={params.row.experimentId}/>
        ),
    },
];

export default function AssayAgenda() {
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().subtract(1, "week"));
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    const [recordedAssaysOnly, setRecordedAssaysOnly] = useState<boolean>(false);
    const [isEditingAnAssay, setIsEditingAnAssay] = useState<boolean>(false);
    const [assayIdBeingEdited, setAssayIdBeingEdited] = useState<number>(-1);

    const [rows, setRows] = useState<AssayInfo[]>([]);

    function reloadAgendaList(paging: ServerPaginationArgs) {
        return fetchAgendaList(
            fromDate,
            toDate,
            recordedAssaysOnly,
            paging
        ).then((res: AssayTable) => {
            setRows(res.rows);
            return res;
        });
    }

    const [paginationProps, reload] = useServerPagination(
        reloadAgendaList,
        [
            {
                field: "targetDate",
                sort: "asc",
            },
        ],
        {
            pageSize: 15,
            page: 0
        });

    useEffect(() => {
        reload();
    }, [fromDate, toDate, recordedAssaysOnly]);
    

    return (
        <Layout>
            <AgendaContext.Provider value={{reload, rows, setRows, assayIdBeingEdited, setAssayIdBeingEdited, isEditing : isEditingAnAssay, setIsEditing : setIsEditingAnAssay}}>
                <Stack spacing={2}>
                    <Box display="flex" flexDirection="row" sx={{ px: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <DatePicker
                                value={fromDate}
                                onChange={(val, context) => context.validationError === null ? setFromDate(val) : null}
                                label="From"
                            />
                            <DatePicker
                                value={toDate}
                                onChange={(val, context) => context.validationError === null ? setToDate(val) : null}
                                label="To"
                            />
                        </Stack>
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-end "
                            flexGrow="1"
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={recordedAssaysOnly}
                                        onChange={(_, val) =>
                                            setRecordedAssaysOnly(val)
                                        }
                                    />
                                }
                                label="Include Recorded Assays"
                            />
                        </Box>
                    </Box>
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
                                ? "assay-cell-recorded"
                                : "assay-cell-not-recorded"
                        }
                        disableColumnMenu
                    />
                    <AssayResultEditorOnAgenda/>
                </Stack>
            </AgendaContext.Provider>
        </Layout>
    );
}
