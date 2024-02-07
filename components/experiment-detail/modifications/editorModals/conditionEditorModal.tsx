import { CloseableModal } from "@/components/shared/closeableModal"
import { ConditionEditingContext } from "@/lib/context/experimentDetailPage/conditionEditingContext"
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useContext, useState, useEffect } from "react"
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { TextField } from "@mui/material";
import { useMutationToDeleteCondition } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useMutationToUpdateCondition } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { ButtonWithConfirmationLoadingAndError } from "@/components/shared/buttonWithConfirmationLoadingAndError";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";


export const ConditionEditorModal = () => {
    const {isEditing, setIsEditing, setConditionIdBeingEdited, conditionIdBeingEdited} = useContext(ConditionEditingContext);
    const {mutate : deleteCondition, isPending : isDeleting, isError : isErrorDeleting, error : errorDeleting} = useMutationToDeleteCondition();
    const {mutate : updateCondition, isPending : isUpdating, isError : isErrorUpdating, error : errorUpdating} = useMutationToUpdateCondition();
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const [newName, setNewName] = useState<string>("");
    useEffect(() => {
        if (data){
            const condition = data?.conditions.findLast((condition) => condition.id === conditionIdBeingEdited);
            if (condition) {
                setNewName(condition.name);
            } else {
                setNewName("");
            }
        }
    }, [data, conditionIdBeingEdited]);
    return (
        <CloseableModal open={isEditing} closeFn={() => setIsEditing(false)} title="Edit Condition">
            <TextField value={newName} onChange={(e) => setNewName(e.target.value)}></TextField>
            <ButtonWithLoadingAndError text="Submit" isError={isErrorUpdating} isLoading={isUpdating} error={errorUpdating} onSubmit={
                () => updateCondition({conditionId : conditionIdBeingEdited, newName : newName})
            }/>
            <ButtonWithConfirmationLoadingAndError text="Delete Condition" isLoading={isDeleting} isError={isErrorDeleting} error={errorDeleting} onSubmit={
                () => deleteCondition(conditionIdBeingEdited)
            }/>
        </CloseableModal>
    )
}
