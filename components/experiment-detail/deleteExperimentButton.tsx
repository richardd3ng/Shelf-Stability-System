import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId"
import { ButtonWithConfirmationLoadingAndError } from "../shared/buttonWithConfirmationLoadingAndError"
import { Typography } from "@mui/material"
import { useMutationToDeleteExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { checkIfAnAssayHasResults } from "@/lib/checkIfAnAssayHasResults";
import { Assay } from "@prisma/client";

export const DeleteExperimentButton = () => {
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const {mutate : deleteExperiment, isPending, isError, error} = useMutationToDeleteExperiment();

    if (!checkIfAnAssayHasResults(data, (assay : Assay) => true)){
        return (
            <ButtonWithConfirmationLoadingAndError text="Delete Experiment" isLoading={isPending} isError={isError} error={error} onSubmit={() => {
                deleteExperiment(experimentId);
            }}/>
        )
        
    } else return (
        <Typography>Cannot delete this experiment, because it has assay results recorded</Typography>
    )
}