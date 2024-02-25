import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Button, Typography } from "@mui/material";
import { useMutationToDeleteExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useRouter } from "next/router";

const DeleteExperimentButton = () => {
    const experimentId = useExperimentId();
    const { mutate: deleteExperiment } = useMutationToDeleteExperiment();
    const router = useRouter();

    const handleDelete = () => {
        deleteExperiment(experimentId);
        router.push("/experiment-list");
    };

    return (
        <Box alignSelf="center">
            <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                sx={{ textTransform: "none" }}
            >
                <Typography align="center">Delete Experiment</Typography>
            </Button>
        </Box>
    );
};

export default DeleteExperimentButton;
