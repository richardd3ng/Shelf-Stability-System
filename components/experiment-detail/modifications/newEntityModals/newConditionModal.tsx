import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { ExperimentAdditionsContext } from "@/lib/context/experimentDetailPage/experimentAdditionsContext";
import { useMutationToCreateCondition } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack, TextField} from "@mui/material";
import { useContext, useState } from "react";

export const NewConditionModal = () => {
    const {isAddingCondition, setIsAddingCondition} = useContext(ExperimentAdditionsContext);
    const experimentId = useExperimentId();
    const control = false;
    const [name, setName] = useState<string>("");
    const {isPending, isError, error, mutate : addNewConditionToDB} = useMutationToCreateCondition();
    const onSubmit = () => {
        addNewConditionToDB({experimentId, control, name});
    }
    return (
        <CloseableModal open={isAddingCondition} closeFn={() => setIsAddingCondition(false)} title={"Add New Condition"}>
            <Stack gap={1}>
                <TextField style={{marginLeft : 4, marginRight : 4}} value={name} label="Name" onChange={(e) => setName(e.target.value)}></TextField>
                <ButtonWithLoadingAndError text="Submit" isLoading={isPending} isError={isError} error={error} onSubmit={onSubmit}/>
            </Stack>
        </CloseableModal>
    );
}
