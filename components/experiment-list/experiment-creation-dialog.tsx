import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
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
import dayjs from "dayjs";
import { fetchDistinctAssayTypes } from "@/lib/controllers/assayTypeController";
import { fetchDistinctConditions } from "@/lib/controllers/conditionController";
import { createExperiment } from "@/lib/controllers/experimentController";
import {
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationResponse,
} from "@/lib/controllers/types";
import { ExperimentCreationArgs } from "@/lib/controllers/types";
import { INVALID_EXPERIMENT_ID } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useAlert } from "@/lib/context/alert-context";
import { useRouter } from "next/router";

interface ExperimentCreationDialogProps {
    open: boolean;
    onClose: () => void;
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
    const [selectedStorageConditions, setSelectedStorageConditions] = useState<
        string[]
    >([]);
    const [newStorageCondition, setNewStorageCondition] = useState<string>("");
    const [creationLoading, setCreationLoading] = useState<boolean>(false);
    const { showAlert } = useAlert();
    const router = useRouter();

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
            showAlert("error", String(error));
        }
    };

    const fetchAndSetStorageConditions = async () => {
        try {
            const distinctConditions: string[] =
                await fetchDistinctConditions();
            setStorageConditions(distinctConditions);
        } catch (error) {
            showAlert("error", String(error));
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

    const checkMissingDetails = (): string[] => {
        const missingDetails: string[] = [];
        if (!title.trim()) {
            missingDetails.push("title");
        }
        if (!date) {
            missingDetails.push("start date");
        }
        if (selectedStorageConditions.length === 0) {
            missingDetails.push("storage condition(s)");
        }
        return missingDetails;
    };

    const generateAlertMessage = (missingDetails: string[]): string => {
        let alertMessage = "Please provide ";
        if (missingDetails.length === 1) {
            alertMessage += `a ${missingDetails[0]} for the experiment.`;
        } else {
            alertMessage += "the following details for the experiment: ";
            alertMessage += missingDetails.slice(0, -1).join(", ");
            alertMessage += `, ${missingDetails[missingDetails.length - 1]}.`;
        }
        return alertMessage;
    };

    const handleCreateExperiment = async () => {
        const missingDetails: string[] = checkMissingDetails();
        if (missingDetails.length > 0) {
            showAlert("error", generateAlertMessage(missingDetails));
            return;
        }
        setCreationLoading(true);
        let experimentId = INVALID_EXPERIMENT_ID;
        try {
            const conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[] =
                selectedStorageConditions.map(
                    (condition: string, index: number) => {
                        return {
                            name: condition,
                            control: index === 0,
                        };
                    }
                );
            const experimentData: ExperimentCreationArgs = {
                title: title,
                description: description,
                start_date: dayjs.utc(date!).toISOString(),
                conditionCreationArgsNoExperimentIdArray:
                    conditionCreationArgsNoExperimentIdArray,
            };
            const experimentResJson: ExperimentCreationResponse =
                await createExperiment(experimentData);
            experimentId = experimentResJson.experiment.id;
            if (experimentId === INVALID_EXPERIMENT_ID) {
                showAlert("error", "Experiment ID is invalid!");
            }
        } catch (error) {
            showAlert("error", String(error));
        }
        setCreationLoading(false);
        if (experimentId !== INVALID_EXPERIMENT_ID) {
            showAlert(
                "success",
                `Successfully created experiment ${experimentId}!`
            );
            router.push(`/experiments/${experimentId}`);
            closeDialog();
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
            showAlert("error", "Storage condition already exists or is empty!");
        }
    };

    const closeDialog = () => {
        resetFields();
        props.onClose();
    };

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setDate(dayjs().toDate());
        setStorageConditions([]);
        setSelectedStorageConditions([]);
        setNewStorageCondition("");
    };

    return (
        <Dialog open={props.open} sx={{ width: "100%" }}>
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
                            timezone="UTC"
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
                            items={storageConditions}
                            label="Storage Conditions *"
                            onChange={(newConditions: string[]) =>
                                setSelectedStorageConditions(newConditions)
                            }
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
                </Stack>
            </DialogContent>
            <DialogActions sx={{ width: "100%" }}>
                <Button sx={{ textTransform: "none" }} onClick={closeDialog}>
                    Cancel
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={handleCreateExperiment}
                    disabled={creationLoading}
                    startIcon={
                        creationLoading && <CircularProgress size={20} />
                    }
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExperimentCreationDialog;
