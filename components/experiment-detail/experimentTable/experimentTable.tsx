import { ExperimentInfo } from "@/lib/controllers/types";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import React, { useEffect, useState } from "react";
import { useAlert } from "@/lib/context/alert-context";
import {
    GridColDef,
    GridRowSelectionModel,
    GridSortItem,
} from "@mui/x-data-grid";
import { LoadingContainer } from "@/components/shared/loading";
import { Assay } from "@prisma/client";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import Table from "@/components/shared/table";
import AddIcon from "@mui/icons-material/Add";
import { NewAssayModal } from "../modifications/newEntityModals/newAssayModal";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";
import { AddWeekModal } from "../addWeekModal";

interface WeekRow {
    id: number;
    week: number;
}

interface AddAssayParams {
    week: number;
    conditionId: number;
}

export const getAssaysForWeekAndCondition = (
    assays: Assay[],
    weekNum: number,
    conditionId: number
): Assay[] => {
    return assays.filter((assay) => {
        return assay.week === weekNum && assay.conditionId === conditionId;
    });
};

export const getAllWeeksCoveredByAssays = (assays: Assay[]): number[] => {
    let weeks: number[] = [];
    assays.forEach((assay: Assay) => {
        if (!weeks.includes(assay.week)) {
            weeks.push(assay.week);
        }
    });
    return weeks;
};

const ExperimentTable: React.FC = () => {
    const { showAlert } = useAlert();
    const experimentId = useExperimentId();
    const { data, isLoading, isError } = useExperimentInfo(experimentId);
    const [weekRows, setWeekRows] = useState<WeekRow[]>([]);
    const [idCounter, setIdCounter] = useState<number>(0);
    const [addAssayParams, setAddAssayParams] = useState<AddAssayParams | null>(
        null
    );
    const [showAddWeekModal, setShowAddWeekModal] = useState<boolean>(false);

    useEffect(() => {
        if (isError) {
            showAlert("error", "Error loading experiment data");
        } else if (
            !data ||
            !data.experiment ||
            !data.assays ||
            !data.conditions
        ) {
            return;
        } else {
            const weeks: number[] = getAllWeeksCoveredByAssays(data.assays);
            const initialWeekRows: WeekRow[] = [];
            weeks.forEach((week: number, index: number) => {
                initialWeekRows.push({
                    id: index,
                    week: week,
                });
            });
            setWeekRows(initialWeekRows);
            setIdCounter(weeks.length);
        }
    }, [data, isError]);

    if (isLoading) {
        return <LoadingContainer />;
    }

    const createTableColumns = (): GridColDef[] => {
        const weekColumn: GridColDef = {
            field: "week",
            headerName: "Wk",
            type: "number",
            width: 50,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
            editable: false,
            sortable: false,
        };
        const conditionCols: GridColDef[] = (data?.conditions || []).map(
            (condition) => ({
                field: condition.name,
                headerName: condition.name,
                renderCell: (params) => {
                    return (
                        <Stack
                            sx={{
                                width: "100%",
                                height: "100%",
                                border: "1px solid #ccc",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <IconButton
                                    sx={{ width: 24, height: 24 }}
                                    onClick={() => {
                                        const weekRow = weekRows.find(
                                            (row) => row.id === params.row.id
                                        );
                                        if (!weekRow) {
                                            showAlert(
                                                "error",
                                                "Week not found for this row"
                                            );
                                            return;
                                        }
                                        setAddAssayParams({
                                            week: weekRow.week,
                                            conditionId: condition.id,
                                        });
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>

                            {getAssaysForWeekAndCondition(
                                data?.assays ?? [],
                                params.row.week,
                                condition.id
                            ).map((assay) => {
                                return (
                                    <Typography key={assay.type}>
                                        {assayTypeIdToName(assay.type)}
                                    </Typography>
                                );
                            })}
                        </Stack>
                    );
                },
                align: "center",
                headerAlign: "center",
                width: 175,
                disableColumnMenu: true,
                editable: false,
                sortable: false,
            })
        );
        return [weekColumn, ...conditionCols];
    };

    const handleAddWeek = (week: number) => {
        const addedRow: WeekRow = {
            id: idCounter,
            week: week,
        };
        setWeekRows([...weekRows, addedRow]);
        setIdCounter(idCounter + 1);
    };

    const tableAddWeekFooter: React.FC = () => {
        return (
            <Box
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowAddWeekModal(true)}
                >
                    Add Week
                </Button>
            </Box>
        );
    };

    return (
        <>
            <NewAssayModal
                open={addAssayParams !== null}
                onClose={() => setAddAssayParams(null)}
                week={addAssayParams?.week ?? -1}
                conditionId={addAssayParams?.conditionId ?? -1}
            />
            <AddWeekModal
                open={showAddWeekModal}
                onClose={() => setShowAddWeekModal(false)}
                onSubmit={handleAddWeek}
            />
            <Table
                columns={createTableColumns()}
                rows={weekRows}
                footer={tableAddWeekFooter}
                sortModel={[
                    {
                        field: "week",
                        sort: "asc",
                    } as GridSortItem,
                ]}
            />
        </>
    );
};

ExperimentTable.defaultProps = {
    assayFilter: (experimentInfo: ExperimentInfo) => experimentInfo.assays,
};
export default ExperimentTable;
