import { useState } from "react";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Button, Typography } from "@mui/material";
import { useMutationToDeleteExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import ConfirmationDialog from "../../shared/confirmationDialog";
import { deleteExperiment } from "@/lib/controllers/experimentController";
import { useAlert } from "@/lib/context/shared/alertContext";
import { ApiError } from "next/dist/server/api-utils";
import { CONFIRMATION_REQUIRED_MESSAGE } from "@/lib/api/error";

const DeleteExperimentButton = () => {
    const experimentId = useExperimentId();
    const { mutate: deleteExperimentMutationFn } =
        useMutationToDeleteExperiment();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);
    const { showAlert } = useAlert();

    const onClick = async () => {
        try {
            await deleteExperiment(experimentId, false);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.message === CONFIRMATION_REQUIRED_MESSAGE) {
                    setShowConfirmationDialog(true);
                } else {
                    showAlert("error", error.message);
                }
            }
        }
    };

    return (
        <>
            <Box alignSelf="center">
                <Button
                    variant="contained"
                    color="error"
                    onClick={onClick}
                    sx={{ textTransform: "none" }}
                >
                    <Typography align="center">Delete Experiment</Typography>
                </Button>
            </Box>
            <ConfirmationDialog
                open={showConfirmationDialog}
                text="Are you sure you want to delete the selected experiment(s)?
                    Only experiments without recorded assay results can be
                    deleted. This action cannot be undone."
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() =>
                    deleteExperimentMutationFn({
                        id: experimentId,
                        confirm: true,
                    })
                }
            />
        </>
    );
};

export default DeleteExperimentButton;
