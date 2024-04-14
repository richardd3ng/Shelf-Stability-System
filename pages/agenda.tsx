import Layout from "@/components/shared/layout";
import { fetchAgendaList } from "@/lib/controllers/assayController";
import { AssayAgendaInfo, AssayAgendaTable } from "@/lib/controllers/types";
import {
    Box,
    Stack,
    Checkbox,
    FormControlLabel,
    Tooltip,
    Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import {
    useServerPagination,
    ServerPaginationArgs,
} from "@/lib/hooks/useServerPagination";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";
import { AssayOptionsBox } from "@/components/agenda/assayOptionsBox";
import { LocalDate } from "@js-joda/core";
import { MyDatePicker } from "@/components/shared/myDatePicker";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { Assay, AssayResult } from "@prisma/client";
import AssayEditorModal from "@/components/experiment-detail/assays/assayEditorModal";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import { useRouter } from "next/router";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";


export default function AssayAgenda() {
    const [fromDate, setFromDate] = useState<LocalDate | null>(
        LocalDate.now().minusWeeks(1)
    );
    const [toDate, setToDate] = useState<LocalDate | null>(null);
    const [includeRecordedAssays, setIncludeRecordedAssays] =
        useState<boolean>(false);
    const [ownedAssaysOnly, setOwnedAssaysOnly] = useState<boolean>(true);

    const [isEditingAnAssay, setIsEditingAnAssay] = useState<boolean>(false);
    const [assayResultBeingEdited, setAssayResultBeingEdited] = useState<
        AssayResult | undefined
    >(undefined);
    const [assayBeingEdited, setAssayBeingEdited] = useState<Assay | undefined>(
        undefined
    );

    const [rows, setRows] = useState<AssayAgendaInfo[]>([]);

    const { user } = useContext(CurrentUserContext);
    const username = user?.username;

    const colDefs: GridColDef[] = [
        {
            field: "targetDate",
            headerName: "Target Date",
            type: "string",
            valueGetter: (params) => params.row.targetDate.toString(),
            width: 150,
        },
        {
            field: "title",
            headerName: "Title",
            type: "string",
            flex: 3,
        },
        {
            field: "ownerDisplayName",
            headerName: "Owner",
            type: "string",
            flex: 1,
            renderCell: (params) => {
                const name = `${params.row.ownerDisplayName} (${params.row.owner})`;
                return params.row.owner === username ? <b>{name}</b> : name;
            },
        },
        {
            field: "technicianDisplayName",
            headerName: "Technician",
            type: "string",
            flex: 1,
            renderCell: (params) => {
                if (params.row.technician === null) return "";
                const name = `${params.row.technicianDisplayName} (${params.row.technician})`;
                return (
                    <Tooltip
                        title={
                            <Typography>
                                Technician for{" "}
                                {params.row.technicianTypes.join(", ")}
                            </Typography>
                        }
                        className="hover-underline"
                    >
                        {params.row.technician === username ? (
                            <b>{name}</b>
                        ) : (
                            <span>{name}</span>
                        )}
                    </Tooltip>
                );
            },
        },
        {
            field: "condition",
            headerName: "Condition",
            type: "string",
            flex: 1,
        },
        {
            field: "week",
            headerName: "Week",
            type: "number",
            width: 70,
        },
        {
            field: "type",
            headerName: "Assay Type",
            type: "string",
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => (
                <AssayOptionsBox
                    owner={params.row.owner}
                    technician={params.row.technician}
                    assayId={params.row.id}
                    assayResultId={params.row.resultId}
                    experimentId={params.row.experimentId}
                />
            ),
        },
    ];

    function reloadAgendaList(paging: ServerPaginationArgs) {
        return fetchAgendaList(
            fromDate,
            toDate,
            includeRecordedAssays,
            ownedAssaysOnly,
            paging
        ).then((res: AssayAgendaTable) => {
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

    const router = useRouter();

    function onCellClick(params: any) {
        if (params.field === "actions") return;
        router.push(
            `/experiments/${params.row.experimentId}#assay-chip-${params.row.id}`
        );
        if (params.field === "actions") return;
        router.push(`/experiments/${params.row.experimentId}`);
    }

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
                            <Box
                                display="flex"
                                flexDirection="row"
                                sx={{ px: 2 }}
                            >
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
                                                    setIncludeRecordedAssays(
                                                        val
                                                    )
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
                                onCellClick={onCellClick}
                                getRowClassName={(_) => "agenda-row-clickable"}
                            />
                            <AssayEditorModal
                                onClose={reload}
                            />
                        </Stack>
                    </AgendaContext.Provider>
                </AssayResultEditingContext.Provider>
            </AssayEditingContext.Provider>
        </Layout>
    );
}
