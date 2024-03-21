import { useState } from "react";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Button, Typography } from "@mui/material";
import { useMutationToCancelExperiment } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import ConfirmationDialog from "../shared/confirmationDialog";

const CancelExperimentButton = () => {
    const experimentId = useExperimentId();
    const { mutate: cancelExperiment } = useMutationToCancelExperiment();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);

    return (
        <>
            <Box alignSelf="center">
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => setShowConfirmationDialog(true)}
                    sx={{ textTransform: "none" }}
                >
                    <Typography align="center">Cancel Experiment</Typography>
                </Button>
            </Box>
            <ConfirmationDialog
                open={showConfirmationDialog}
                text="Are you sure you want to cancel this experiment? This action cannot be undone"
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() => cancelExperiment(experimentId)}
            />
        </>
    );
};

export default CancelExperimentButton;
