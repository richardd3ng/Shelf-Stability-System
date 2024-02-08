
import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToUpdateAssay, useMutationToUpdateAssayResult } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { TextField, Stack, Typography } from "@mui/material";
import React, { useContext,  useState, useEffect } from "react";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { ButtonWithConfirmationLoadingAndError } from "@/components/shared/buttonWithConfirmationLoadingAndError";
import { useMutationToDeleteAssay, useMutationToDeleteAssayResult } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { CloseableModal } from "@/components/shared/closeableModal";
import { checkIfAnAssayHasResults } from "@/lib/checkIfAnAssayHasResults";
import { Assay } from "@prisma/client";
import { MyDatePicker } from "@/components/shared/myDatePicker";



const DEFAULT_RESULT = null;

export const AssayEditorModal: React.FC = () => {
    const {isEditing, setIsEditing, assayIdBeingEdited} = useContext(AssayEditingContext);
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId);
    const [newResult, setNewResult] = useState<string | null>(DEFAULT_RESULT);
    const [newTargetDate, setNewTargetDate] = useState<Date>(new Date(Date.now()));
    const {mutate : deleteAsasy, isPending : isDeleting, isError : isErrorDeleting, error : errorDeleting} = useMutationToDeleteAssay();
    const {mutate : deleteAssayResult, isPending : isDeletingResult, isError : isErrorDeletingResult, error : errorDeletingResult} = useMutationToDeleteAssayResult();
    const {mutate : updateAssayInDB, isPending : isUpdatingDB, isError : isErrorUpdatingDB, error : errorUpdatingAssay} = useMutationToUpdateAssay();
    useEffect(() => {
        if (data) {
            const assay = data?.assays.findLast((assay) => assay.id === assayIdBeingEdited);
            if (assay ) {
                setNewResult(assay.result);
                setNewTargetDate(assay.target_date);
            } 
        } else {
            setNewResult(null);
        }
    }, [data, assayIdBeingEdited, isEditing]);

    let assayHasResults = checkIfAnAssayHasResults(data, (assay : Assay) => assay.id === assayIdBeingEdited);
    if (!isEditing || isError || isLoading || !data ){
        return null;
    } else {

        return (
            <CloseableModal open={isEditing} closeFn={() => setIsEditing(false)} title="Edit Assay">
                <Stack direction="column">
                    <Stack direction="row" style={{marginBottom : 8, marginRight : 4}}>
                        <TextField label="Result" style={{marginLeft : 4, marginRight : 4}} value={newResult} onChange={(e) => setNewResult(e.target.value)}></TextField>
                        <ButtonWithLoadingAndError text="Delete Result" isLoading={isDeletingResult} isError={isErrorDeletingResult} error={errorDeletingResult} onSubmit={
                            () => deleteAssayResult(assayIdBeingEdited)
                        }/>
                    </Stack>
                    {
                        assayHasResults
                        ?
                        <Typography>You cannot edit the date for an assay with recorded results</Typography>
                        :
                        <MyDatePicker label="Target Date" setDate={setNewTargetDate} date={newTargetDate} />
                    }
                    
                    <ButtonWithLoadingAndError text="Submit New Result" isError={isErrorUpdatingDB} isLoading={isUpdatingDB} error={errorUpdatingAssay} onSubmit={
                        () => {updateAssayInDB({assayId : assayIdBeingEdited, newTargetDate, newResult, shouldUpdateTargetDate : !assayHasResults})}
                    }/>
                    {
                        assayHasResults 
                        ?
                        <Typography>You cannot delete an assay with recorded results</Typography>
                        :
                        <ButtonWithConfirmationLoadingAndError text="Delete Assay" isLoading={isDeleting} isError={isErrorDeleting} error={errorDeleting} onSubmit={
                            () => deleteAsasy(assayIdBeingEdited)
                        }/>

                    }
                    
                </Stack>
            </CloseableModal>
            

        );
    };
}
