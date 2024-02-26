import { ExperimentInfo } from "@/lib/controllers/types";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "@/lib/context/shared/alertContext";
import {
    GridColDef,
    GridDeleteIcon,
    GridRenderCellParams,
    GridSortItem,
    GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import { Assay, AssayResult, Condition } from "@prisma/client";
import {
    Box,
    Button,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import Table from "@/components/shared/table";
import AddIcon from "@mui/icons-material/Add";
import { NewAssayModal } from "../modifications/newEntityModals/newAssayModal";
import { AddWeekModal } from "../addWeekModal";
import AssayChip from "./assayChip";
import { NewConditionModal } from "../modifications/newEntityModals/newConditionModal";
import { useMutationToDeleteCondition } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import StarIcon from "@mui/icons-material/Star";
import Edit from "@mui/icons-material/Edit";
import ConditionEditorModal from "../modifications/editorModals/conditionEditorModal";
import ConditionEditingContext from "@/lib/context/experimentDetailPage/conditionEditingContext";
import { INVALID_CONDITION_ID } from "@/lib/api/apiHelpers";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";

export interface WeekRow {
    id: number;
    week: number;
}

interface AddAssayParams {
    week: number;
    conditionId: number;
}

interface ExperimentTableProps {
    assayFilter: (experimentInfo: ExperimentInfo) => Assay[];
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

export const getAssayResultForAssay = (
    assayResults: AssayResult[],
    assay: Assay
): AssayResult | null => {
    let results: AssayResult[] = [];
    for (let result of assayResults) {
        if (result.assayId === assay.id) {
            results.push(result);
            return result;
        }
    }
    return null;
};

const ExperimentTable: React.FC<ExperimentTableProps> = (
    props: ExperimentTableProps
) => {
    const { showAlert } = useAlert();
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const [weekRows, setWeekRows] = useState<WeekRow[]>([]);
    const [idCounter, setIdCounter] = useState<number>(0);
    const [addAssayParams, setAddAssayParams] = useState<AddAssayParams | null>(
        null
    );
    const [showAddConditionModal, setShowAddConditionModal] =
        useState<boolean>(false);
    const [showAddWeekModal, setShowAddWeekModal] = useState<boolean>(false);
    const { mutate: deleteCondition } = useMutationToDeleteCondition();
    const [conditionIdBeingEdited, setConditionIdBeingEdited] =
        useState<number>(INVALID_CONDITION_ID);
    const WEEK_COL_WIDTH = 50;
    const CONDITION_COL_WIDTH = 150;
    const { user } = useContext(CurrentUserContext);
    const isAdmin: boolean = user?.is_admin ?? false;
    const isAdminOrOwner: boolean =
        (user?.is_admin || user?.id === data?.experiment.ownerId) ?? false;

    useEffect(() => {
        if (!data) {
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
    }, [data]);

    const columnHeader = (condition: Condition): React.JSX.Element => {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Tooltip
                            title="Control Condition"
                            arrow
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: "offset",
                                            options: {
                                                offset: [0, -8],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <StarIcon
                                sx={{ fontSize: 16 }}
                                color="primary"
                                visibility={condition.control ? "" : "hidden"}
                            />
                        </Tooltip>
                    </Box>
                </Box>
                <Typography
                    variant="subtitle2"
                    sx={{
                        flex: 1,
                        textAlign: "center",
                    }}
                >
                    {condition.name}
                </Typography>
                {isAdmin && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingRight: 3,
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={() =>
                                setConditionIdBeingEdited(condition.id)
                            }
                        >
                            <Edit sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{ marginLeft: -1 }}
                            onClick={() => deleteCondition(condition.id)}
                        >
                            <GridDeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>
                )}
            </Box>
        );
    };

    const tableCell = (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>,
        condition: Condition
    ): React.JSX.Element => {
        return (
            <Stack
                sx={{
                    minWidth: CONDITION_COL_WIDTH,
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
                    {isAdminOrOwner && (
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
                    )}
                </Box>

                {getAssaysForWeekAndCondition(
                    data ? props.assayFilter(data) : [],
                    params.row.week,
                    condition.id
                ).map((assay: Assay) => {
                    const assayResult: AssayResult | undefined =
                        getAssayResultForAssay(
                            data?.assayResults ?? [],
                            assay
                        ) ?? undefined;
                    return (
                        <AssayChip
                            key={assay.type}
                            assay={assay}
                            assayResult={assayResult}
                        ></AssayChip>
                    );
                })}
            </Stack>
        );
    };

    const createTableColumns = (): GridColDef[] => {
        const weekColumn: GridColDef = {
            field: "week",
            headerName: "Wk",
            type: "number",
            width: WEEK_COL_WIDTH,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
            editable: false,
            sortable: false,
        };
        const conditionCols: GridColDef[] = (data?.conditions || []).map(
            (condition: Condition) => ({
                field: condition.name,
                headerName: condition.name,
                align: "center",
                headerAlign: "center",
                width: CONDITION_COL_WIDTH,
                disableColumnMenu: true,
                editable: false,
                sortable: false,
                renderHeader: () => columnHeader(condition),
                renderCell: (params) => tableCell(params, condition),
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

    const tableFooter: React.FC = () => {
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
                    onClick={() => setShowAddConditionModal(true)}
                    sx={{ marginRight: 2, textTransform: "none" }}
                >
                    + Condition
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowAddWeekModal(true)}
                    sx={{ textTransform: "none" }}
                >
                    + Week
                </Button>
            </Box>
        );
    };

    return (
        <>
            <AddWeekModal
                open={showAddWeekModal}
                weekRows={weekRows}
                onClose={() => setShowAddWeekModal(false)}
                onSubmit={handleAddWeek}
            />
            <ConditionEditingContext.Provider
                value={{
                    id: conditionIdBeingEdited,
                    setId: setConditionIdBeingEdited,
                    isEditing: conditionIdBeingEdited !== INVALID_CONDITION_ID,
                    setIsEditing: () => {
                        setConditionIdBeingEdited(INVALID_CONDITION_ID);
                    },
                }}
            >
                <ConditionEditorModal />
            </ConditionEditingContext.Provider>
            <NewAssayModal
                open={addAssayParams !== null}
                onClose={() => setAddAssayParams(null)}
                week={addAssayParams?.week ?? -1}
                conditionId={addAssayParams?.conditionId ?? -1}
            />
            <NewConditionModal
                open={showAddConditionModal}
                onClose={() => setShowAddConditionModal(false)}
            />
            <Table
                columns={createTableColumns()}
                rows={weekRows}
                footer={isAdmin ? tableFooter : undefined}
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
