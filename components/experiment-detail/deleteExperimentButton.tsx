import { useState } from "react";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Button, Typography } from "@mui/material";
import { useMutationToDeleteExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import ConfirmationDialog from "../shared/confirmationDialog";

const DeleteExperimentButton = () => {
    const experimentId = useExperimentId();
    const { mutate: deleteExperiment } = useMutationToDeleteExperiment();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);

    return (
        <>
            <Box alignSelf="center">
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowConfirmationDialog(true)}
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
                onConfirm={() => deleteExperiment(experimentId)}
            />
        </>
    );
};

export default DeleteExperimentButton;
