import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MultiSelectDropdown from "../shared/multi-select-dropdown";
import Table from "../shared/table";
import dayjs from "dayjs";
import { createAssays } from "@/lib/controllers/assayController";
import {
    createAssayTypes,
    fetchDistinctAssayTypes,
} from "@/lib/controllers/assayTypeController";
import {
    createConditions,
    fetchDistinctConditions,
} from "@/lib/controllers/conditionController";
import { createExperiment } from "@/lib/controllers/experimentController";
import {
    AssayCreationArgs,
    AssayTypeCreationArgs,
    ConditionCreationArgs,
    ExperimentCreationArgs,
} from "@/lib/controllers/types";
import { AssayType, Condition, Experiment } from "@prisma/client";

interface ExperimentCreationDialogProps {
    open: boolean;
    onClose: (reason: string) => void;
}

interface WeekRow {
    id: number;
    week: number;
}

interface AssayScheduleTypesMap {
    [rowId: number]: {
        [condition: string]: string[];
    };
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

const ExperimentCreationDialog: React.FC<ExperimentCreationDialogProps> = (
    props: ExperimentCreationDialogProps
) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<Date | null>(dayjs().toDate());
    const [assayTypes, setAssayTypes] = useState<string[]>([]);
    const [storageConditions, setStorageConditions] = useState<string[]>([]);
    const [selectedAssayTypes, setSelectedAssayTypes] = useState<string[]>([]);
    const [selectedStorageConditions, setSelectedStorageConditions] = useState<
        string[]
    >([]);
    const [newAssayType, setNewAssayType] = useState<string>("");
    const [newStorageCondition, setNewStorageCondition] = useState<string>("");
    const [weekRows, setWeekRows] = useState<WeekRow[]>([]);
    const [idCounter, setIdCounter] = useState<number>(1);
    const [assayScheduleTypeMap, setAssayScheduleTypeMap] =
        useState<AssayScheduleTypesMap>({});

    useEffect(() => {
        fetchAndSetAssayTypes();
        fetchAndSetStorageConditions();
    }, []);

    const fetchAndSetAssayTypes = async () => {
        try {
            const distinctAssayTypes: string[] =
                await fetchDistinctAssayTypes();
            setAssayTypes(distinctAssayTypes);
        } catch (error) {
            alert(error);
        }
    };

    const fetchAndSetStorageConditions = async () => {
        try {
            const distinctConditions: string[] =
                await fetchDistinctConditions();
            setStorageConditions(distinctConditions);
        } catch (error) {
            alert(error);
        }
    };

    const handleDateChange = (dayjs: dayjs.Dayjs | null) => {
        if (dayjs) {
            setDate(dayjs.toDate());
        } else {
            setDate(null);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        if (newTitle.length <= MAX_TITLE_LENGTH) {
            setTitle(newTitle);
        }
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newDescription = e.target.value;
        if (newDescription.length <= MAX_DESCRIPTION_LENGTH) {
            setDescription(newDescription);
        }
    };

    const handleAddWeek = () => {
        const addedRow: WeekRow = {
            id: idCounter,
            week: 0,
        };
        setWeekRows([...weekRows, addedRow]);
        setIdCounter(idCounter + 1);
    };

    const handleDeleteWeeks = (selectedRows: GridRowSelectionModel) => {
        const newMap: AssayScheduleTypesMap = Object.fromEntries(
            Object.entries(assayScheduleTypeMap).filter(
                ([rowId]) => !selectedRows.includes(Number(rowId))
            )
        );
        setAssayScheduleTypeMap(newMap);
        const remainingRows: WeekRow[] = weekRows.filter(
            (row) => !selectedRows.includes(row.id)
        );
        setWeekRows(remainingRows);
    };

    const handleCreateExperiment = async (reason: string) => {
        const missingComponents: string[] = [];
        if (!title.trim()) {
            missingComponents.push("title");
        }
        if (!date) {
            missingComponents.push("start date");
        }
        if (missingComponents.length > 0) {
            let alertMessage = "Please provide ";
            if (missingComponents.length === 1) {
                alertMessage += `a ${missingComponents[0]} for the experiment.`;
            } else {
                alertMessage += "the following details for the experiment: ";
                alertMessage += missingComponents.slice(0, -1).join(", ");
                alertMessage += `, ${
                    missingComponents[missingComponents.length - 1]
                }.`;
            }
            alert(alertMessage);
            return;
        }
        const experimentData: ExperimentCreationArgs = {
            title: title,
            description: description,
            start_date: date!.toISOString(),
        };
        try {
            const experimentResJson: Experiment = await createExperiment(
                experimentData
            );
            const experimentId = experimentResJson.id;
            const assayTypes: AssayTypeCreationArgs[] = selectedAssayTypes.map(
                (type: string) => {
                    return {
                        experimentId: experimentId,
                        name: type,
                    };
                }
            );
            const conditions: ConditionCreationArgs[] =
                selectedStorageConditions.map(
                    (condition: string, index: number) => {
                        return {
                            experimentId: experimentId,
                            name: condition,
                            control: index === 0,
                        };
                    }
                );
            const [createdAssayTypes, createdConditions]: [
                AssayType[],
                Condition[]
            ] = await Promise.all([
                createAssayTypes(assayTypes),
                createConditions(conditions),
            ]);
            const assayTypeToId = new Map<string, number>(
                createdAssayTypes.map((type) => [type.name, type.id])
            );
            const conditionToId = new Map<string, number>(
                createdConditions.map((condition) => [
                    condition.name,
                    condition.id,
                ])
            );
            const rowIdToWeek = new Map<number, number>(
                weekRows.map((row) => [row.id, row.week])
            );
            const assayCreationData: AssayCreationArgs[] = [];
            Object.entries(assayScheduleTypeMap).forEach(
                ([rowId, conditionsMap]) => {
                    Object.entries(conditionsMap).forEach(
                        ([condition, types]) => {
                            const conditionId = conditionToId.get(condition);
                            if (conditionId === undefined) {
                                alert(
                                    `Condition ID not found for ${condition}`
                                );
                                return;
                            }
                            (types as string[]).forEach((type) => {
                                const typeId = assayTypeToId.get(type);
                                if (typeId === undefined) {
                                    alert(
                                        `Assay type ID not found for ${type}`
                                    );
                                    return;
                                }
                                assayCreationData.push({
                                    experimentId: experimentId,
                                    conditionId: conditionId,
                                    typeId: typeId,
                                    target_date: dayjs()
                                        .add(
                                            rowIdToWeek.get(parseInt(rowId)) ||
                                                0,
                                            "weeks"
                                        )
                                        .toDate(),
                                    result: null,
                                });
                            });
                        }
                    );
                }
            );
            createAssays(assayCreationData);
        } catch (error) {
            alert(error);
        }
        resetFields();
        props.onClose(reason);
    };

    const handleAddAssayType = () => {
        if (!assayTypes.includes(newAssayType) && newAssayType.trim() !== "") {
            setAssayTypes([...assayTypes, newAssayType]);
            setNewAssayType("");
        } else {
            alert("Assay type already exists or is invalid!");
        }
    };

    const handleAddStorageCondition = () => {
        if (
            !storageConditions.includes(newStorageCondition) &&
            newStorageCondition.trim() !== ""
        ) {
            setStorageConditions([...storageConditions, newStorageCondition]);
            setNewStorageCondition("");
        } else {
            alert("Storage condition already exists or is empty!");
        }
    };

    const handleChangeSelectedAssayTypes = (
        newSelectedAssayTypes: string[]
    ) => {
        if (newSelectedAssayTypes.length === 0) {
            setWeekRows([]);
            setAssayScheduleTypeMap({});
        } else {
            const newMap: AssayScheduleTypesMap = {};
            Object.entries(assayScheduleTypeMap).forEach(
                ([rowId, conditionsMap]) => {
                    const filteredConditionsMap: {
                        [condition: string]: string[];
                    } = {};
                    Object.entries(conditionsMap).forEach(
                        ([condition, values]) => {
                            const newValues: string[] = [];
                            (values as string[]).forEach((value) => {
                                if (newSelectedAssayTypes.includes(value)) {
                                    newValues.push(value);
                                }
                            });
                            if (newValues.length > 0) {
                                filteredConditionsMap[condition] = newValues;
                            }
                        }
                    );
                    if (Object.keys(filteredConditionsMap).length > 0) {
                        newMap[Number(rowId)] = filteredConditionsMap;
                    }
                }
            );
            setAssayScheduleTypeMap(newMap);
        }
        setSelectedAssayTypes(newSelectedAssayTypes);
    };

    const handleChangeSelectedStorageConditions = (
        newSelectedStorageConditions: string[]
    ) => {
        if (newSelectedStorageConditions.length === 0) {
            setWeekRows([]);
            setAssayScheduleTypeMap({});
        } else {
            const newMap: AssayScheduleTypesMap = {};
            Object.entries(assayScheduleTypeMap).forEach(
                ([rowId, conditionsMap]) => {
                    const filteredConditionsMap: {
                        [condition: string]: string[];
                    } = {};
                    Object.entries(conditionsMap).forEach(
                        ([condition, values]) => {
                            if (
                                newSelectedStorageConditions.includes(condition)
                            ) {
                                filteredConditionsMap[condition] =
                                    values as string[];
                            }
                        }
                    );
                    if (Object.keys(filteredConditionsMap).length > 0) {
                        newMap[Number(rowId)] = filteredConditionsMap;
                    }
                }
            );
            setAssayScheduleTypeMap(newMap);
        }
        setSelectedStorageConditions(newSelectedStorageConditions);
    };

    const createTableColumns = (): GridColDef[] => {
        const weekColumn: GridColDef = {
            field: "week",
            headerName: "Week",
            type: "number",
            width: 70,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
            editable: true,
            sortable: false,
        };
        const storageConditionColumns: GridColDef[] =
            selectedStorageConditions.map((condition) => ({
                field: condition,
                headerName: condition,
                renderCell: (params) => {
                    return (
                        <MultiSelectDropdown
                            items={selectedAssayTypes}
                            label="Select Types"
                            size="small"
                            onChange={(newAssayTypes: string[]) =>
                                setAssayScheduleTypeMap((prevMap) => {
                                    const newMap: AssayScheduleTypesMap = {
                                        ...prevMap,
                                    };
                                    if (params.row.id in newMap) {
                                        newMap[params.row.id][condition] =
                                            newAssayTypes;
                                    } else {
                                        newMap[params.row.id] = {
                                            [condition]: newAssayTypes,
                                        };
                                    }
                                    return newMap;
                                })
                            }
                        />
                    );
                },
                align: "center",
                headerAlign: "center",
                width: 175,
                disableColumnMenu: true,
                editable: true,
                sortable: false,
            }));
        return [weekColumn, ...storageConditionColumns];
    };

    const handleWeekUpdate = (newRow: WeekRow): WeekRow => {
        const rowIndex = weekRows.findIndex((row) => row.id === newRow.id);
        if (rowIndex !== -1) {
            const updatedRows: WeekRow[] = [...weekRows];
            newRow.week = Math.max(0, newRow.week);
            updatedRows[rowIndex] = newRow;
            setWeekRows(updatedRows);
        }
        return newRow;
    };

    const handleCancelExperiment = (reason: string) => {
        resetFields();
        props.onClose(reason);
    };

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setDate(dayjs().toDate());
        setSelectedAssayTypes([]);
        setSelectedStorageConditions([]);
        setNewAssayType("");
        setNewStorageCondition("");
        setSelectedAssayTypes([]);
        setSelectedStorageConditions([]);
        setWeekRows([]);
        setIdCounter(1);
        setAssayScheduleTypeMap({});
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
                    onClick={handleAddWeek}
                >
                    Add Week
                </Button>
            </Box>
        );
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            sx={{ width: "100%" }}
        >
            <DialogTitle sx={{ width: "100%" }}>Add New Experiment</DialogTitle>
            <DialogContent sx={{ width: "100%" }}>
                <Stack spacing={1.5}>
                    <DialogContentText>
                        Fill in the details for the new experiment (* indicates
                        required fields).
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        onChange={handleTitleChange}
                        inputProps={{
                            maxLength: MAX_TITLE_LENGTH,
                        }}
                        helperText={`${title.length}/${MAX_TITLE_LENGTH} characters`}
                        required
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        onChange={handleDescriptionChange}
                        inputProps={{
                            maxLength: MAX_DESCRIPTION_LENGTH,
                        }}
                        helperText={`${description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            defaultValue={dayjs()}
                            onChange={handleDateChange}
                            slotProps={{
                                textField: {
                                    required: true,
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MultiSelectDropdown
                            items={assayTypes}
                            label="Assay Types"
                            onChange={handleChangeSelectedAssayTypes}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 2,
                            }}
                        >
                            <TextField
                                value={newAssayType}
                                onChange={(e) =>
                                    setNewAssayType(e.target.value)
                                }
                                label="New Assay Type"
                                inputProps={{ style: { fontSize: "0.8rem" } }}
                                InputLabelProps={{
                                    style: { fontSize: "0.8rem" },
                                }}
                            />
                            <Button
                                sx={{ textTransform: "none" }}
                                onClick={handleAddAssayType}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MultiSelectDropdown
                            items={storageConditions}
                            label="Storage Conditions"
                            onChange={handleChangeSelectedStorageConditions}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 2,
                            }}
                        >
                            <TextField
                                value={newStorageCondition}
                                onChange={(e) =>
                                    setNewStorageCondition(e.target.value)
                                }
                                label="New Condition"
                                inputProps={{ style: { fontSize: "0.8rem" } }}
                                InputLabelProps={{
                                    style: { fontSize: "0.8rem" },
                                }}
                            />
                            <Button
                                sx={{ textTransform: "none" }}
                                onClick={handleAddStorageCondition}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>

                    {selectedAssayTypes.length > 0 &&
                        selectedStorageConditions.length > 0 && (
                            <Stack>
                                <DialogContentText>
                                    Assay Schedule
                                </DialogContentText>
                                <Table
                                    columns={createTableColumns()}
                                    rows={weekRows}
                                    footer={tableAddWeekFooter}
                                    sortModel={[{ field: "week", sort: "asc" }]}
                                    onDeleteRows={handleDeleteWeeks}
                                    processRowUpdate={handleWeekUpdate}
                                />
                            </Stack>
                        )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ width: "100%" }}>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleCancelExperiment("Cancel")}
                >
                    Cancel
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleCreateExperiment("Create")}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExperimentCreationDialog;
