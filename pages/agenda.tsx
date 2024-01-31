import { fetchAgendaList } from "@/lib/controllers/assays";
import { AssayInfo } from "@/lib/controllers/types";
import { CheckBox } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";

function fetchExperiments(): Assay[] {
    return [
        {
            id: 100000,
            targetDate: new Date("2024-01-25"),
            title: "Pizza Experiment",
            condition: "0F",
            week: 3,
            type: "Sensory"
        },
        {
            id: 100001,
            targetDate: new Date("2024-02-01"),
            title: "Pizza Experiment",
            condition: "0F",
            week: 4,
            type: "Hexanal"
        },
        {
            id: 100002,
            targetDate: new Date("2022-02-01"),
            title: "Pizza Experiment",
            condition: "0F",
            week: 4,
            type: "Sensory"
        },
        {
            id: 100003,
            targetDate: new Date("2022-02-01"),
            title: "Cereal Experiment",
            condition: "10F",
            week: 2,
            type: "Sensory"
        },
        {
            id: 100004,
            targetDate: new Date("2022-02-01"),
            title: "Cereal Experiment",
            condition: "20F",
            week: 2,
            type: "Sensory"
        },
        {
            id: 100005,
            targetDate: new Date("2022-02-08"),
            title: "Cereal Experiment",
            condition: "20F",
            week: 3,
            type: "Sensory"
        },
    ];
};

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

    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [rows, setRows] = useState<AssayInfo[]>([]);

    function reloadAgendaList() {
        console.log(fromDate, toDate);
        console.log(fromDate?.day());
        if ((fromDate !== null && isNaN(fromDate.day())) || (toDate !== null && isNaN(toDate.day()))) return;
        console.log("fetching");
        fetchAgendaList(fromDate, toDate).then((res) => setRows(res));
    }

    useEffect(() => {
        reloadAgendaList();
    }, [fromDate, toDate]);

    return (
        <Stack spacing={2}>
            <Box display="flex" flexDirection="row">
                <Stack direction="row" spacing={2}>
                    <DatePicker value={fromDate} onChange={setFromDate} label="From" />
                    <DatePicker value={toDate} onChange={setToDate} label="To" />
                </Stack>
                <Box display="flex" flexDirection="row" justifyContent="flex-end " flexGrow="1" alignItems="center">
                    <CheckBox />
                    Include Recorded Assays
                </Box>
            </Box>
            <DataGrid
                rows={rows}
                columns={colDefs}
                hideFooterPagination
                autoHeight
                sortModel={sortModel}
                onSortModelChange={setSortModel}
            />
        </Stack>
    );
}
