import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";
import { useContext, useState, useEffect } from "react";
import { CloseableModal } from "../shared/closeableModal";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";
import { useMutationToDeleteAssayResultFromAgenda, useMutationToUpdateAssayResultFromAgenda } from "@/lib/hooks/agendaPage/updateAssayResult";
import { Stack, TextField } from "@mui/material";
import { ButtonWithLoadingAndError } from "../shared/buttonWithLoadingAndError";
export const AssayResultEditorOnAgenda = () => {
    const {assayIdBeingEdited, setAssayIdBeingEdited, isEditing, setIsEditing, rows} = useContext(AgendaContext);
    const {mutate : updateResult, isPending: isLoadingUpdate, isError: isErrorUpdating, error: errorUpdating} = useMutationToUpdateAssayResultFromAgenda();
    const {mutate : deleteResult, isPending : isDeleting, isError : isErrorDeleting, error : errorDeleting} = useMutationToDeleteAssayResultFromAgenda();
    const [newResult, setNewResult] = useState<string | null>(null);
    useEffect(() => {
        const assay = rows.findLast((row) => row.id === assayIdBeingEdited);
        if (assay) {
            setNewResult(assay.result);
        }
    }, [rows, assayIdBeingEdited]);

    return (
        <CloseableModal title="Edit Assay Result" open={isEditing} closeFn={() => {
            setIsEditing(false);
        }}>
            <Stack gap={1}>
                <TextField label="Result" value={newResult} onChange={(e) => setNewResult(e.target.value)}></TextField>
                <ButtonWithLoadingAndError text="Submit New Result" isError={isErrorUpdating} isLoading={isLoadingUpdate} error={errorUpdating} onSubmit={() => {
                    if (newResult){
                        updateResult({newResult, assayId : assayIdBeingEdited});
                    }
                }}/>
                <ButtonWithLoadingAndError text="Delete Assay Result" isError={isErrorDeleting} isLoading={isDeleting} error={errorDeleting} onSubmit={() => {
                    deleteResult(assayIdBeingEdited);
                }}/>
            </Stack>
        </CloseableModal>
    );
}