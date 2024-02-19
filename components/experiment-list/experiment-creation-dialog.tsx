import React, { useState } from "react";
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
import MultiSelectDropdown from "../shared/multi-select-dropdown";
import { createExperiment } from "@/lib/controllers/experimentController";
import {
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationResponse,
} from "@/lib/controllers/types";
import { ExperimentCreationArgs } from "@/lib/controllers/types";
import { useAlert } from "@/lib/context/alert-context";
import { useRouter } from "next/router";
import { LocalDate } from "@js-joda/core";
import { MyDatePicker } from "../shared/myDatePicker";
import { getErrorMessage } from "@/lib/api/apiHelpers";

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
    const [date, setDate] = useState<LocalDate | null>(LocalDate.now());
    const [storageConditions, setStorageConditions] = useState<string[]>([]);
    const [selectedStorageConditions, setSelectedStorageConditions] = useState<
        string[]
    >([]);
    const [newStorageCondition, setNewStorageCondition] = useState<string>("");
    const [creationLoading, setCreationLoading] = useState<boolean>(false);
    const { showAlert } = useAlert();
    const router = useRouter();

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
                start_date: date!,
                conditionCreationArgsNoExperimentIdArray:
                    conditionCreationArgsNoExperimentIdArray,
                ownerId: 1, // TODO: Replace with actual owner ID
            };
            const experimentResJson: ExperimentCreationResponse =
                await createExperiment(experimentData);
            showAlert(
                "success",
                `Successfully created experiment ${experimentResJson.experiment.id}!`
            );
            router.push(`/experiments/${experimentResJson.experiment.id}`);
        } catch (error) {
            showAlert("error", getErrorMessage(error));
        }
        setCreationLoading(false);
        closeDialog();
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
        setDate(LocalDate.now());
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
                    <MyDatePicker
                        label="Start Date"
                        defaultValue={LocalDate.now()}
                        onChange={setDate}
                        slotProps={{
                            textField: {
                                required: true,
                            },
                        }}
                    />
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
