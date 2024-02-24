import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Button, Typography } from "@mui/material";
import { useMutationToDeleteExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";

const DeleteExperimentButton = () => {
    const experimentId = useExperimentId();
    const { mutate: deleteExperiment } = useMutationToDeleteExperiment();

    return (
        <Box alignSelf="center">
            <Button
                variant="contained"
                color="error"
                onClick={() => deleteExperiment(experimentId)}
                sx={{ textTransform: "none" }}
            >
                <Typography align="center">Delete Experiment</Typography>
            </Button>
        </Box>
    );
};

export default DeleteExperimentButton;
