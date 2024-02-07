
import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToUpdateAssayResult } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { TextField} from "@mui/material";
import React, { useContext,  useState, useEffect } from "react";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { ButtonWithConfirmationLoadingAndError } from "@/components/shared/buttonWithConfirmationLoadingAndError";
import { useMutationToDeleteAssay } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { CloseableModal } from "@/components/shared/closeableModal";



const DEFAULT_RESULT = "";

export const AssayEditorModal: React.FC = () => {
    const {isEditing, setIsEditing, assayIdBeingEdited} = useContext(AssayEditingContext);
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId);
    const [newResult, setNewResult] = useState<string>(DEFAULT_RESULT);
    const {mutate : updateAssayResultInDB, isPending : isUpdatingDB, isError : isErrorUpdatingDB, error : errorUpdatingAssay} = useMutationToUpdateAssayResult();
    const {mutate : deleteAsasy, isPending : isDeleting, isError : isErrorDeleting, error : errorDeleting} = useMutationToDeleteAssay();

    useEffect(() => {
        if (data) {
            const assay = data?.assays.findLast((assay) => assay.id === assayIdBeingEdited);
            if (assay && assay.result) {
                setNewResult(assay.result);
            } else {
                setNewResult(DEFAULT_RESULT);
            }
        } else {
            setNewResult(DEFAULT_RESULT);
        }
    }, [data, assayIdBeingEdited]);


    if (!isEditing || isError || isLoading || !data ){
        return null;
    } else {

        return (
            <CloseableModal open={isEditing} closeFn={() => setIsEditing(false)} title="Edit Assay">
                <TextField value={newResult} onChange={(e) => setNewResult(e.target.value)}></TextField>
                <ButtonWithLoadingAndError text="Submit" isError={isErrorUpdatingDB} isLoading={isUpdatingDB} error={errorUpdatingAssay} onSubmit={
                    () => {updateAssayResultInDB({assayId : assayIdBeingEdited, experimentId : experimentId, newResult})}
                }/>
                <ButtonWithConfirmationLoadingAndError text="Delete Assay" isLoading={isDeleting} isError={isErrorDeleting} error={errorDeleting} onSubmit={
                    () => deleteAsasy(assayIdBeingEdited)
                }/>
            </CloseableModal>

        );
    };
}
