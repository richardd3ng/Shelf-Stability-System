import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToUpdateExperiment } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Button, Stack, TextField } from "@mui/material";
import { MyDatePicker } from "@/components/shared/myDatePicker";
import React, { useContext, useState, useEffect } from "react";
import CloseableModal from "@/components/shared/closeableModal";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { LocalDate } from "@js-joda/core";
import { useAlert } from "@/lib/context/shared/alertContext";
import { ExperimentUpdateArgs } from "@/lib/controllers/types";
import { hasRecordedAssayResults } from "@/lib/controllers/experimentController";
import ExperimentDetailContext from "@/lib/context/experimentDetailPage/experimentEditingContext";

const ExperimentEditorModal: React.FC = () => {
    const experimentId = useExperimentId();
    const { data, isLoading, isError, error } = useExperimentInfo(experimentId);
    const { isEditing, setIsEditing } = useContext(ExperimentDetailContext);
    const { mutate: updateExperiment } = useMutationToUpdateExperiment();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [allowEditStartDate, setAllowEditStartDate] =
        useState<boolean>(false);
    const [startDate, setStartDate] = useState<LocalDate | null>(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchMetadata = async () => {
            if (!data) {
                return;
            }
            setTitle(data.experiment.title);
            setDescription(data.experiment.description || "");
            setAllowEditStartDate(
                !(await hasRecordedAssayResults(experimentId))
            );
        };
        fetchMetadata();
    }, [data, experimentId]);

    const handleSubmit = () => {
        if (title.trim() === "") {
            showAlert("error", "Experiment title cannot be empty");
            return;
        }
        const experimentUpdateArgs: ExperimentUpdateArgs = {
            id: experimentId,
            title: title,
            description: description ? description : null,
            userId: 1,
        };
        if (allowEditStartDate) {
            if (startDate) {
                const parsedDate = new Date(startDate.toString());
                if (!isNaN(parsedDate.getTime())) {
                    experimentUpdateArgs.startDate = startDate;
                } else {
                    showAlert("error", "Start date is invalid");
                    return;
                }
            } else {
                showAlert("error", "Start date is required");
                return;
            }
        }
        updateExperiment(experimentUpdateArgs);
        setIsEditing(false);
    };

    if (isLoading) {
        return <></>;
    } else if (isError || !data) {
        return <ErrorMessage message={getErrorMessage(error)} />;
    }
    return (
        <CloseableModal
            open={isEditing}
            hideBackdrop
            closeFn={() => setIsEditing(false)}
            title="Edit Experiment"
        >
            <Stack style={{ marginBottom: 8, marginRight: 4 }} spacing={1}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Description"
                    value={description}
                    fullWidth
                    multiline
                    rows={4}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {allowEditStartDate && (
                    <MyDatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                        }}
                    />
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ textTransform: "none" }}
                >
                    Submit
                </Button>
            </Stack>
        </CloseableModal>
    );
};

export default ExperimentEditorModal;
