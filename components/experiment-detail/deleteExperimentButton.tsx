import { useState } from "react";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Button, Typography } from "@mui/material";
import { useMutationToDeleteExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import ExperimentDeletionDialog from "../shared/experimentDeletionDialog";

const DeleteExperimentButton = () => {
    const experimentId = useExperimentId();
    const { mutate: deleteExperiment } = useMutationToDeleteExperiment();
    const [showDeletionDialog, setShowDeletionDialog] =
        useState<boolean>(false);

    return (
        <>
            <Box alignSelf="center">
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeletionDialog(true)}
                    sx={{ textTransform: "none" }}
                >
                    <Typography align="center">Delete Experiment</Typography>
                </Button>
            </Box>
            <ExperimentDeletionDialog
                open={showDeletionDialog}
                onClose={() => setShowDeletionDialog(false)}
                onDelete={() => deleteExperiment(experimentId)}
            />
        </>
    );
};

export default DeleteExperimentButton;
