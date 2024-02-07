import { CloseableModal } from "@/components/shared/closeableModal"
import { ConditionEditingContext } from "@/lib/context/experimentDetailPage/conditionEditingContext"
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useContext, useState, useEffect } from "react"
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { Stack, TextField, Typography } from "@mui/material";
import { useMutationToDeleteCondition } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useMutationToMakeConditionTheControl, useMutationToUpdateCondition } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { ButtonWithConfirmationLoadingAndError } from "@/components/shared/buttonWithConfirmationLoadingAndError";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { checkIfAnAssayHasResults } from "@/lib/checkIfAnAssayHasResults";


export const ConditionEditorModal = () => {
    const {isEditing, setIsEditing, setConditionIdBeingEdited, conditionIdBeingEdited} = useContext(ConditionEditingContext);
    const {mutate : deleteCondition, isPending : isDeleting, isError : isErrorDeleting, error : errorDeleting} = useMutationToDeleteCondition();
    const {mutate : updateCondition, isPending : isUpdating, isError : isErrorUpdating, error : errorUpdating} = useMutationToUpdateCondition();
    const {mutate : makeConditionTheControl, isPending : isUpdatingControl, isError : isErrorMakingContorl, error : errorMakingControl} = useMutationToMakeConditionTheControl();
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const [newName, setNewName] = useState<string>("");
    const [newControl, setNewControl] = useState<boolean>(false);
    const [originalControl, setOriginalControl] = useState<boolean>(false);
    useEffect(() => {
        if (data){
            const condition = data?.conditions.findLast((condition) => condition.id === conditionIdBeingEdited);
            if (condition) {
                setNewName(condition.name);
                if (condition.control !== null){
                    setNewControl(condition.control);
                    setOriginalControl(condition.control);
                }
            } else {
                setNewName("");
            }
        }
    }, [data, conditionIdBeingEdited]);
    return (
        <CloseableModal open={isEditing} closeFn={() => setIsEditing(false)} title="Edit Condition">
            {
                originalControl 
                ? 
                <Typography color="green" style={{marginBottom : 8}}>This condition is the control</Typography>
                :
                <Stack direction="row" gap={1} style={{marginBottom : 8}}>
                    <Typography style={{marginBottom : 8}}>This is not the control</Typography>
                    <ButtonWithLoadingAndError text="Make this the control" isError={isErrorMakingContorl} isLoading={isUpdatingControl} error={errorMakingControl} onSubmit={() => {
                        makeConditionTheControl({conditionId : conditionIdBeingEdited});
                    }}/>
                </Stack>
                
                
            }
            {
                checkIfAnAssayHasResults(data, (assay) => assay.conditionId === conditionIdBeingEdited)
                ?
                <Typography style={{marginLeft : 4, marginRight : 4}}>You cannot edit this condition, as it has an assay with results recorded</Typography>
                :
                <>
                    <Stack>
                        <TextField style={{marginLeft : 4, marginRight : 4}} label="Name" value={newName} onChange={(e) => setNewName(e.target.value)}></TextField>
                        <ButtonWithLoadingAndError text="Submit New Name" isError={isErrorUpdating} isLoading={isUpdating} error={errorUpdating} onSubmit={
                            () => updateCondition({conditionId : conditionIdBeingEdited, newName : newName})
                        }/>
                        {
                            originalControl 
                            ?
                            <Typography>You cannot delete this condition, because it is the control</Typography>
                            :
                            <ButtonWithConfirmationLoadingAndError text="Delete Condition" isLoading={isDeleting} isError={isErrorDeleting} error={errorDeleting} onSubmit={
                                () => deleteCondition(conditionIdBeingEdited)
                            }/>


                        }
                        
                    </Stack>
                </>
            }
            
        </CloseableModal>
    )
}
