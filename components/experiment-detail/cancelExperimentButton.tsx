import { useState } from "react";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Button, Typography } from "@mui/material";
import { useMutationToUpdateExperiment } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import ConfirmationDialog from "../shared/confirmationDialog";

interface CancelExperimentButtonProps {
    cancel: boolean;
}

const CancelExperimentButton = (props: CancelExperimentButtonProps) => {
    const experimentId = useExperimentId();
    const { mutate: updateExperiment } = useMutationToUpdateExperiment();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);

    const dialogText = `Are you sure you want to ${
        props.cancel ? "cancel" : "uncancel"
    } this experiment? This will ${
        props.cancel ? "disallow" : "allow"
    } modifications to the experiment and its assays.`;

    return (
        <>
            <Box alignSelf="center">
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => setShowConfirmationDialog(true)}
                    sx={{ textTransform: "none" }}
                >
                    <Typography align="center">{`${
                        props.cancel ? "Cancel" : "Uncancel"
                    } Experiment`}</Typography>
                </Button>
            </Box>
            <ConfirmationDialog
                open={showConfirmationDialog}
                text={dialogText}
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() =>
                    updateExperiment({
                        id: experimentId,
                        isCanceled: props.cancel,
                    })
                }
            />
        </>
    );
};

export default CancelExperimentButton;
