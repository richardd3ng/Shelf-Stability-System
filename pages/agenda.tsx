import Layout from "@/components/shared/layout";
import { fetchAgendaList } from "@/lib/controllers/assayController";
import { AssayInfo, AssayTable } from "@/lib/controllers/types";
import { Box, Stack, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
    useServerPagination,
    ServerPaginationArgs,
} from "@/lib/hooks/useServerPagination";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";
import { AssayOptionsBox } from "@/components/agenda/assayOptionsBox";
import { AssayResultEditorOnAgenda } from "@/components/agenda/assayResultEditorOnAgenda";
import { LocalDate } from "@js-joda/core";
import { MyDatePicker } from "@/components/shared/myDatePicker";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { Assay, AssayResult } from "@prisma/client";
import AssayEditorModal from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";

const colDefs: GridColDef[] = [
    {
        field: "targetDate",
        headerName: "Target Date",
        type: "string",
        valueGetter: (params) => params.row.targetDate.toString(),
        flex: 2,
    },
    {
        field: "title",
        headerName: "Title",
        type: "string",
        flex: 4,
    },
    {
        field: "owner",
        headerName: "Owner",
        type: "string",
        flex: 2,
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
        renderCell: (params) => (
            <AssayOptionsBox
                assayId={params.row.id}
                assayResultId={params.row.resultId}
                experimentId={params.row.experimentId}
            />
        ),
    },
];

export default function AssayAgenda() {
    const [fromDate, setFromDate] = useState<LocalDate | null>(
        LocalDate.now().minusWeeks(1)
    );
    const [toDate, setToDate] = useState<LocalDate | null>(null);
    const [includeRecordedAssays, setIncludeRecordedAssays] =
        useState<boolean>(false);
    const [ownedAssaysOnly, setOwnedAssaysOnly] = useState<boolean>(true);

    const [isEditingAnAssay, setIsEditingAnAssay] = useState<boolean>(false);
    const [assayResultBeingEdited, setAssayResultBeingEdited] = useState<AssayResult | undefined>(undefined);
    const [assayBeingEdited, setAssayBeingEdited] = useState<Assay | undefined>(undefined);

    const [rows, setRows] = useState<AssayInfo[]>([]);

    function reloadAgendaList(paging: ServerPaginationArgs) {
        return fetchAgendaList(
            fromDate,
            toDate,
            includeRecordedAssays,
            ownedAssaysOnly,
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
            page: 0,
        }
    );

    useEffect(() => {
        reload();
    }, [fromDate, toDate, includeRecordedAssays, ownedAssaysOnly]);

    return (
        <Layout>
            <AssayEditingContext.Provider
                value={{
                    assay: assayBeingEdited,
                    setAssay: setAssayBeingEdited, 
                    isEditing: isEditingAnAssay,
                    setIsEditing: setIsEditingAnAssay,
                }}
            >
                <AssayResultEditingContext.Provider
                    value={{
                        assayResult: assayResultBeingEdited,
                        setAssayResult: setAssayResultBeingEdited,
                        isEditing: isEditingAnAssay,
                        setIsEditing: setIsEditingAnAssay,
                    }}
                >
                    <AgendaContext.Provider
                        value={{
                            reload,
                            rows,
                            setRows,
                        }}
                    >
                        <Stack spacing={2}>
                            <Box display="flex" flexDirection="row" sx={{ px: 2 }}>
                                <Stack direction="row" spacing={2}>
                                    <MyDatePicker
                                        value={fromDate}
                                        onChange={(val, context) =>
                                            context.validationError === null
                                                ? setFromDate(val)
                                                : null
                                        }
                                        label="From"
                                    />
                                    <MyDatePicker
                                        value={toDate}
                                        onChange={(val, context) =>
                                            context.validationError === null
                                                ? setToDate(val)
                                                : null
                                        }
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
                                                checked={includeRecordedAssays}
                                                onChange={(_, val) =>
                                                    setIncludeRecordedAssays(val)
                                                }
                                            />
                                        }
                                        label="Include Recorded Assays"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={ownedAssaysOnly}
                                                onChange={(_, val) =>
                                                    setOwnedAssaysOnly(val)
                                                }
                                            />
                                        }
                                        label="Only My Assays"
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
                                    params.row.resultId !== null
                                        ? "assay-cell-recorded"
                                        : "assay-cell-not-recorded"
                                }
                                disableColumnMenu
                            />
                            <AssayEditorModal
                                onlyEditResult
                                onClose={reload}
                            />
                        </Stack>
                    </AgendaContext.Provider>
                </AssayResultEditingContext.Provider>
            </AssayEditingContext.Provider>
        </Layout>
    );
}
