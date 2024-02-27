import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Chip,
} from "@mui/material";
import { UserInfo, UserTable } from "@/lib/controllers/types";
import { createExperiment } from "@/lib/controllers/experimentController";
import {
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationResponse,
} from "@/lib/controllers/types";
import { ExperimentCreationArgs } from "@/lib/controllers/types";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { useRouter } from "next/router";
import { LocalDate } from "@js-joda/core";
import { MyDatePicker } from "../shared/myDatePicker";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { INVALID_USER_ID } from "@/lib/hooks/useUserInfo";
import { fetchUserList } from "@/lib/controllers/userController";

interface ExperimentCreationDialogProps {
    open: boolean;
    onClose: () => void;
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

const ExperimentCreationDialog: React.FC<ExperimentCreationDialogProps> = (
    props: ExperimentCreationDialogProps
) => {
    const { user } = useContext(CurrentUserContext);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<LocalDate | null>(LocalDate.now());
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [ownerId, setOwnerId] = useState<number>(INVALID_USER_ID);
    const [conditionName, setConditionName] = useState<string>("");
    const [storageConditions, setStorageConditions] = useState<string[]>([]);
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            const userTable: UserTable = await fetchUserList("");
            setUsers(userTable.rows);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (user) {
            setOwnerId(user.id);
        }
    }, [user]);

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
        if (ownerId === INVALID_USER_ID) {
            missingDetails.push("owner");
        }
        if (!date) {
            missingDetails.push("start date");
        }
        if (storageConditions.length === 0) {
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

    const handleAddStorageCondition = () => {
        setStorageConditions([...storageConditions, conditionName]);
        setConditionName("");
    };

    const handleDeleteStorageCondition = (index: number) => {
        const conditions = [...storageConditions];
        conditions.splice(index, 1);
        setStorageConditions(conditions);
    };

    const handleCreateExperiment = async () => {
        const missingDetails: string[] = checkMissingDetails();
        if (missingDetails.length > 0) {
            showAlert("error", generateAlertMessage(missingDetails));
            return;
        }
        showLoading("Creating experiment...");
        try {
            const conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[] =
                storageConditions.map((condition: string, index: number) => ({
                    name: condition,
                    control: index === 0,
                }));
            const experimentData: ExperimentCreationArgs = {
                title: title,
                description: description,
                start_date: date!,
                conditionCreationArgsNoExperimentIdArray:
                    conditionCreationArgsNoExperimentIdArray,
                ownerId: ownerId,
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
            return;
        }
        hideLoading();
        closeDialog();
    };

    const closeDialog = () => {
        resetFields();
        props.onClose();
    };

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setOwnerId(INVALID_USER_ID);
        setDate(LocalDate.now());
        setConditionName("");
        setStorageConditions([]);
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
                        value={title}
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
                        value={description}
                        onChange={handleDescriptionChange}
                        inputProps={{
                            maxLength: MAX_DESCRIPTION_LENGTH,
                        }}
                        helperText={`${description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="Owner" required>
                            Owner
                        </InputLabel>
                        <Select
                            id="Owner"
                            value={ownerId}
                            label="Owner"
                            onChange={(e) => setOwnerId(Number(e.target.value))}
                        >
                            {users.map((user: UserInfo) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <MyDatePicker
                        label="Start Date"
                        value={date}
                        onChange={setDate}
                        slotProps={{
                            textField: {
                                required: true,
                            },
                        }}
                    />
                    <DialogContentText
                        sx={{
                            marginY: -2,
                        }}
                    >
                        Storage Conditions
                    </DialogContentText>
                    <Box sx={{ border: "1px solid #ccc", minHeight: 42 }}>
                        {storageConditions.map((condition, index) => (
                            <Chip
                                key={index}
                                label={condition}
                                onDelete={() =>
                                    handleDeleteStorageCondition(index)
                                }
                                sx={{ margin: 0.5 }}
                            />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Condition Name"
                            sx={{ width: "70%" }}
                            value={conditionName}
                            onChange={(e) => setConditionName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddStorageCondition();
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: "none" }}
                            onClick={handleAddStorageCondition}
                        >
                            + Condition
                        </Button>
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
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExperimentCreationDialog;
