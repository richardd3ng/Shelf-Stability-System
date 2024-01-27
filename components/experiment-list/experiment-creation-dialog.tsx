import React, { useState } from "react";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MultiSelectDropdown from "../shared/multi-select-dropdown";
import Table from "../shared/table";
import dayjs from "dayjs";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

interface ExperimentCreationDialogProps {
    open: boolean;
    onClose: (
        event: React.SyntheticEvent<Element, Event>,
        reason: string
    ) => void;
}

interface AssayScheduleRow {
    id: number;
    week: number;
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;
const assayTypes = [
    "Sensory",
    "Moisture",
    "Hexanal",
    "Peroxide value",
    "Anisidine",
    "Free fatty acid",
];

const storageConditions = ["0 F", "70F 38%", "73F 50%", "80F 65%", "100F 20%"];

const ExperimentCreationDialog = (props: ExperimentCreationDialogProps) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedAssayTypes, setSelectedAssayTypes] = useState<string[]>([]);
    const [selectedStorageConditions, setSelectedStorageConditions] = useState<
        string[]
    >([]);
    const [assayScheduleRows, setAssayScheduleRows] = useState<
        AssayScheduleRow[]
    >([]);
    const [idCounter, setIdCounter] = useState<number>(1);

    const handleDateChange = (dayjs: dayjs.Dayjs | null) => {
        if (dayjs) {
            setSelectedDate(dayjs.toDate());
        } else {
            setSelectedDate(null);
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

    const handleAssayTypeChange = (newAssayTypes: string[]) => {
        setSelectedAssayTypes(newAssayTypes);
    };

    const handleStorageConditionChange = (newStorageConditions: string[]) => {
        setSelectedStorageConditions(newStorageConditions);
    };

    const handleAddWeek = () => {
        const addedRow: AssayScheduleRow = {
            id: idCounter,
            week: 0,
        };
        setAssayScheduleRows([...assayScheduleRows, addedRow]);
        setIdCounter(idCounter + 1);
    };

    const handleDeleteWeeks = (selectedRows: GridRowSelectionModel) => {
        const remainingRows = assayScheduleRows.filter(
            (row) => !selectedRows.includes(row.id)
        );
        setAssayScheduleRows(remainingRows);
    };

    const handleCreateExperiment = (
        event: React.SyntheticEvent<Element, Event>,
        reason: string
    ) => {
        // TODO: Create experiment in database
        props.onClose(event, reason);
    };

    const handleCancelExperiment = (
        event: React.SyntheticEvent<Element, Event>,
        reason: string
    ) => {
        setSelectedAssayTypes([]);
        setSelectedStorageConditions([]);
        setAssayScheduleRows([]);
        props.onClose(event, reason);
    };

    const createTableColumns = (): GridColDef[] => {
        const weekColumn: GridColDef = {
            field: "week",
            headerName: "Week",
            type: "number",
            width: 80,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
            editable: true,
            sortable: false,
        };
        const storageConditionColumns: GridColDef[] =
            selectedStorageConditions.map((condition, _) => ({
                field: condition,
                headerName: condition,
                renderCell: () => {
                    return (
                        <MultiSelectDropdown
                            items={selectedAssayTypes}
                            label="Select Types"
                            size="small"
                            onChange={(newAssayTypes) =>
                                console.log(newAssayTypes)
                            }
                        />
                    );
                },
                align: "center",
                headerAlign: "center",
                width: 150,
                disableColumnMenu: true,
                editable: true,
                sortable: false,
            }));
        return [weekColumn, ...storageConditionColumns];
    };

    const tableAddWeekFooter = () => {
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
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add New Experiment</DialogTitle>
            <DialogContent sx={{ width: 600 }}>
                <Stack spacing={1.5}>
                    <DialogContentText>
                        Fill in the details for the new experiment.
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
                            onChange={(newDate) => handleDateChange(newDate)}
                        />
                    </LocalizationProvider>
                    <MultiSelectDropdown
                        items={assayTypes}
                        label="Assay Types"
                        onChange={(newAssayTypes) =>
                            handleAssayTypeChange(newAssayTypes)
                        }
                    />
                    <MultiSelectDropdown
                        items={storageConditions}
                        label="Storage Conditions"
                        onChange={(newStorageConditions) =>
                            handleStorageConditionChange(newStorageConditions)
                        }
                    />
                    {selectedAssayTypes.length > 0 &&
                        selectedStorageConditions.length > 0 && (
                            <Stack>
                                <DialogContentText>
                                    Assay Schedule
                                </DialogContentText>
                                <Table
                                    columns={createTableColumns()}
                                    rows={assayScheduleRows}
                                    footer={tableAddWeekFooter}
                                    onDeleteRows={(
                                        selectedRows: GridRowSelectionModel
                                    ) => handleDeleteWeeks(selectedRows)}
                                />
                            </Stack>
                        )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={(event) => handleCancelExperiment(event, "Cancel")}
                >
                    Cancel
                </Button>
                <Button
                    onClick={(event) => handleCreateExperiment(event, "Create")}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExperimentCreationDialog;
