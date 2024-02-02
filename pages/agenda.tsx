import { fetchAgendaList } from "@/lib/controllers/assays";
import { AssayInfo, AssayTable } from "@/lib/controllers/types";
import { Box, Stack, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

const colDefs: GridColDef[] = [
    {
        field: "targetDate",
        headerName: "Target Date",
        type: "date",
        flex: 2
    },
    {
        field: "title",
        headerName: "Title",
        type: "string",
        flex: 4
    },
    {
        field: "condition",
        headerName: "Condition",
        type: "string",
        flex: 2
    },
    {
        field: "week",
        headerName: "Week",
        type: "number",
        flex: 1
    },
    {
        field: "type",
        headerName: "Assay Type",
        type: "string",
        flex: 2
    },
];

export default function AssayAgenda() {
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: 'targetDate',
            sort: 'asc',
        },
    ]);

    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    const [recordedAssaysOnly, setRecordedAssaysOnly] = useState<boolean>(false);
    const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

    const [rows, setRows] = useState<AssayInfo[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);

    function reloadAgendaList() {
        if ((fromDate !== null && isNaN(fromDate.day())) || (toDate !== null && isNaN(toDate.day()))) return;
        fetchAgendaList(fromDate, toDate, recordedAssaysOnly, sortModel, pagination).then((res: AssayTable) => {
            setRows(res.rows);
            setRowCount(res.rowCount);
        });
    }

    useEffect(() => {
        reloadAgendaList();
    }, [fromDate, toDate, recordedAssaysOnly, pagination]);

    useEffect(() => {
        // When sorting changes, only reload if paging is happening
        if (rowCount > pagination.pageSize) {
            reloadAgendaList();
        }
    }, [sortModel]);

    return (
        <Stack spacing={2}>
            <Box display="flex" flexDirection="row">
                <Stack direction="row" spacing={2}>
                    <DatePicker value={fromDate} onChange={setFromDate} label="From" />
                    <DatePicker value={toDate} onChange={setToDate} label="To" />
                </Stack>
                <Box display="flex" flexDirection="row" justifyContent="flex-end " flexGrow="1">
                    <FormControlLabel control={
                        <Checkbox value={recordedAssaysOnly} onChange={(e, val) => setRecordedAssaysOnly(val)} />
                    } label="Include Recorded Assays" />
                </Box>
            </Box>
            <DataGrid
                rows={rows}
                rowCount={rowCount}
                columns={colDefs}
                rowSelection={false}
                autoHeight
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                getCellClassName={(params) => params.row.result !== null ? "assay-cell-recorded" : "assay-cell-not-recorded"}
                pagination
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                paginationMode="server"
            />
        </Stack>
    );
}
