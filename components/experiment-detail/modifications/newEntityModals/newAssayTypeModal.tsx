import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { ExperimentAdditionsContext } from "@/lib/context/experimentDetailPage/experimentAdditionsContext";
import { useMutationToCreateAssayType, useMutationToCreateCondition } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { TextField} from "@mui/material";
import { useContext, useState } from "react";

export const NewAssayTypeModal = () => {
    const {isAddingAssayType, setIsAddingAssayType} = useContext(ExperimentAdditionsContext);
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const [name, setName] = useState<string>("");
    const {isLoading, isError, error, mutate : createAssayType} = useMutationToCreateAssayType();

    const onSubmit = () => {
        createAssayType({name : name, experimentId : experimentId});
    }
    return (
        <CloseableModal open={isAddingAssayType} closeFn={() => setIsAddingAssayType(false)} title={"Add New Assay Type"}>
            <TextField value={name} onChange={(e) => setName(e.target.value)}></TextField>
            <ButtonWithLoadingAndError text="Submit" isLoading={isLoading} isError={isError} error={error} onClick={onSubmit}/>
        </CloseableModal>
    );
}
