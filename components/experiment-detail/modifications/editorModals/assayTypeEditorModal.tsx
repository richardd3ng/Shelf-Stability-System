import { CloseableModal } from "@/components/shared/closeableModal"
import { AssayTypeEditingContext } from "@/lib/context/experimentDetailPage/assayTypeEditingContext"
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToDeleteAssayType } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useMutationToUpdateAssayType } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { Typography, TextField, Stack } from "@mui/material";
import { useContext, useState, useEffect } from "react"
import { ButtonWithConfirmationLoadingAndError } from "@/components/shared/buttonWithConfirmationLoadingAndError";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { checkIfAnAssayHasResults } from "@/lib/checkIfAnAssayHasResults";

export const AssayTypeEditorModal = () => {
    const {isEditing, setIsEditing, assayTypeIdBeingEdited, setAssayTypeIdBeingEdited} = useContext(AssayTypeEditingContext);
    const {mutate : deleteAssayType, isPending : isDeleting, isError : isErrorDeleting, error : errorDeleting} = useMutationToDeleteAssayType();
    const {mutate : updateAssayType, isPending : isUpdating, isError : isErrorUpdating, error : errorUpdating} = useMutationToUpdateAssayType();
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const DEFAULT_RESULT = "";
    const [newName, setNewName] = useState<string>(DEFAULT_RESULT);
    useEffect(() => {
        if (data) {
            const assayType = data?.assayTypes.findLast((type) => type.id === assayTypeIdBeingEdited);
            if (assayType){
                setNewName(assayType.name);
            }
        } else {
            setNewName(DEFAULT_RESULT);
        }
    }, [data, assayTypeIdBeingEdited]);
    
    return (
        <CloseableModal open={isEditing} closeFn={() => setIsEditing(false)} title={"Edit Assay type"}>
            {
                checkIfAnAssayHasResults(data, (assay) => assay.typeId === assayTypeIdBeingEdited) 
                ? 
                <Typography style={{marginLeft : 4, marginRight : 4}}>You cannot edit this assay type, as it has an assay with results</Typography>
                :
                <>
                    <Stack>
                        <TextField style={{marginLeft : 4, marginRight : 4}} label="Name" value={newName} onChange={(e) => setNewName(e.target.value)}></TextField>
                        <ButtonWithLoadingAndError text="Submit" isError={isErrorUpdating} isLoading={isUpdating} error={errorUpdating} onSubmit={
                            () => updateAssayType({assayTypeId : assayTypeIdBeingEdited, newName : newName})
                        }/>
                        <ButtonWithConfirmationLoadingAndError text="Delete Assay Type" isLoading={isDeleting} isError={isErrorDeleting} error={errorDeleting} onSubmit={
                            () => deleteAssayType(assayTypeIdBeingEdited)
                        }/>
                    </Stack>
                </>

            }
            
        </CloseableModal>
    )
}
