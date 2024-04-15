import { ExperimentInfo } from "@/lib/controllers/types";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import React, { useContext, useEffect, useState } from "react";
import {
    GridColDef,
    GridRenderCellParams,
    GridRowSelectionModel,
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
import { NewAssayModal } from "../assays/newAssayModal";
import { AddWeekModal } from "./addWeekModal";
import AssayChip from "../assays/assayChip";
import { NewConditionModal } from "../conditions/newConditionModal";
import StarIcon from "@mui/icons-material/Star";
import Edit from "@mui/icons-material/Edit";
import ConditionEditorModal from "../conditions/conditionEditorModal";
import ConditionEditingContext from "@/lib/context/experimentDetailPage/conditionEditingContext";
import {
    INVALID_CONDITION_ID,
    parseExperimentWeeks,
} from "@/lib/api/apiHelpers";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import DeleteConditionButton from "../conditions/deleteConditionButton";
import { useMutationToUpdateExperiment } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import ConfirmationDialog from "@/components/shared/confirmationDialog";
import { useMutationToDeleteExperimentWeeks } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";

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
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const [weekRows, setWeekRows] = useState<WeekRow[]>([]);
    const [selectedWeeks, setSelectedWeeks] = useState<GridRowSelectionModel>(
        []
    );
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);
    const [addAssayParams, setAddAssayParams] = useState<AddAssayParams | null>(
        null
    );
    const [showAddConditionModal, setShowAddConditionModal] =
        useState<boolean>(false);
    const [showAddWeekModal, setShowAddWeekModal] = useState<boolean>(false);
    const [conditionIdBeingEdited, setConditionIdBeingEdited] =
        useState<number>(INVALID_CONDITION_ID);
    const WEEK_COL_WIDTH = 50;
    const CONDITION_COL_WIDTH = 150;
    const { user } = useContext(CurrentUserContext);
    const isCanceled: boolean = experimentInfo?.experiment.isCanceled ?? false;
    const isAdminEditable: boolean = (!isCanceled && user?.isAdmin) ?? false;
    const isAdminOrOwnerEditable: boolean =
        (!isCanceled &&
            (user?.isAdmin ||
                user?.id === experimentInfo?.experiment.ownerId)) ??
        false;
    const { mutate: updateExperiment } = useMutationToUpdateExperiment();
    const { mutate: deleteExperimentWeeks } =
        useMutationToDeleteExperimentWeeks();

    useEffect(() => {
        if (!experimentInfo) {
            return;
        } else {
            const weeks: number[] = parseExperimentWeeks(
                experimentInfo.experiment.weeks
            );
            const initialWeekRows: WeekRow[] = [];
            weeks.forEach((week) => {
                initialWeekRows.push({
                    id: week,
                    week: week,
                });
            });
            setWeekRows(initialWeekRows);
        }
    }, [experimentInfo]);

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
                                visibility={condition.isControl ? "" : "hidden"}
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
                {isAdminEditable && (
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
                        <DeleteConditionButton
                            id={condition.id}
                            name={condition.name}
                        />
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
                    {isAdminOrOwnerEditable && (
                        <IconButton
                            sx={{ width: 24, height: 24 }}
                            onClick={() => {
                                const weekRow = weekRows.find(
                                    (row) => row.id === params.row.id
                                );
                                if (!weekRow) {
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
                    experimentInfo ? props.assayFilter(experimentInfo) : [],
                    params.row.week,
                    condition.id
                ).map((assay: Assay) => {
                    const assayResult: AssayResult | undefined =
                        getAssayResultForAssay(
                            experimentInfo?.assayResults ?? [],
                            assay
                        ) ?? undefined;
                    return (
                        <AssayChip
                            key={assay.assayTypeId}
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
        const conditionCols: GridColDef[] = (
            experimentInfo?.conditions || []
        ).map((condition: Condition) => ({
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
        }));
        return [weekColumn, ...conditionCols];
    };

    const handleAddWeek = (week: number) => {
        const weeks: number[] =
            (experimentInfo &&
                parseExperimentWeeks(experimentInfo.experiment.weeks)) ||
            [];
        weeks.push(week);
        updateExperiment({
            id: experimentId,
            weeks: weeks.join(","),
        });
    };

    const prepareForDeletions = (selectedRows: GridRowSelectionModel) => {
        setSelectedWeeks(selectedRows);
        setShowConfirmationDialog(true);
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
                footer={isAdminEditable ? tableFooter : undefined}
                sortModel={[
                    {
                        field: "week",
                        sort: "asc",
                    } as GridSortItem,
                ]}
                checkboxSelection={!isCanceled}
                onDeleteRows={prepareForDeletions}
            />
            <ConfirmationDialog
                open={showConfirmationDialog}
                text="Are you sure you want to delete the selected week(s)? Only weeks without recorded assay results can be deleted. Deleted weeks will result in all assays in that week being deleted. This action cannot be undone."
                onClose={() => {
                    setShowConfirmationDialog(false);
                }}
                onConfirm={() =>
                    deleteExperimentWeeks({
                        id: experimentId,
                        weeks: selectedWeeks as number[],
                    })
                }
            />
        </>
    );
};

ExperimentTable.defaultProps = {
    assayFilter: (experimentInfo: ExperimentInfo) => experimentInfo.assays,
};
export default ExperimentTable;
