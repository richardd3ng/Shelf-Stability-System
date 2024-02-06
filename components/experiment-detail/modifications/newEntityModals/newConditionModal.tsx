import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { ExperimentAdditionsContext } from "@/lib/context/experimentDetailPage/experimentAdditionsContext";
import { useMutationToCreateCondition } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { TextField} from "@mui/material";
import { useContext, useState } from "react";

export const NewConditionModal = () => {
    const {isAddingCondition, setIsAddingCondition} = useContext(ExperimentAdditionsContext);
    const experimentId = useExperimentId();
    const control = false;
    const [name, setName] = useState<string>("");
    const {isLoading, isError, error, mutate : addNewConditionToDB} = useMutationToCreateCondition();
    const onSubmit = () => {
        addNewConditionToDB({experimentId, control, name});
    }
    return (
        <CloseableModal open={isAddingCondition} closeFn={() => setIsAddingCondition(false)} title={"Add New Condition"}>
            <TextField value={name} onChange={(e) => setName(e.target.value)}></TextField>
            <ButtonWithLoadingAndError text="Submit" isLoading={isLoading} isError={isError} error={error} onClick={onSubmit}/>
        </CloseableModal>
    );
}
