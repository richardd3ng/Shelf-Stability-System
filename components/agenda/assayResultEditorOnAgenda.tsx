import { AssayEditingContext } from "@/lib/context/shared/assayEditingContext";
import { useContext, useState, useEffect } from "react";
import { CloseableModal } from "../shared/closeableModal";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";
import {
    useMutationToCreateAssayResultFromAgenda,
    useMutationToUpdateAssayResultFromAgenda,
    useMutationToDeleteAssayResultFromAgenda,
} from "@/lib/hooks/agendaPage/updateAssayResult";
import { Stack, TextField } from "@mui/material";
import { ButtonWithLoadingAndError } from "../shared/buttonWithLoadingAndError";
import { AssayInfo, AssayResultUpdateArgs } from "@/lib/controllers/types";
import { useAlert } from "@/lib/context/shared/alertContext";

export const AssayResultEditorOnAgenda = () => {
    const { rows } = useContext(AgendaContext);
    const {
        assayIdBeingEdited,
        isEditing: isEditingAssay,
        setIsEditing: setIsEditingAssay,
    } = useContext(AssayEditingContext);
    const {
        mutate: createAssayResult,
        isPending: isLoadingCreate,
        isError: isErrorCreating,
        error: errorCreating,
    } = useMutationToCreateAssayResultFromAgenda();
    const {
        mutate: updateAssayResult,
        isPending: isLoadingUpdate,
        isError: isErrorUpdating,
        error: errorUpdating,
    } = useMutationToUpdateAssayResultFromAgenda();
    const {
        mutate: deleteAssayResult,
        isPending: isDeleting,
        isError: isErrorDeleting,
        error: errorDeleting,
    } = useMutationToDeleteAssayResultFromAgenda();

    const { showAlert } = useAlert();
    const [assayResultId, setAssayResultId] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [comment, setComment] = useState<string | null>(null);

    useEffect(() => {
        const assay: AssayInfo | undefined = rows.findLast(
            (row) => row.id === assayIdBeingEdited
        );
        setAssayResultId(assay?.assayResultId ?? null);
        setResult(assay?.result ?? null);
        setComment(assay?.comment ?? null);
    }, [rows, assayIdBeingEdited]);

    const handleChangeNewResult = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(Number(e.target.value))) {
            showAlert("error", "Invalid input: Please enter a valid number");
        } else {
            setResult(Number(e.target.value));
        }
    };

    const handleSubmit = () => {
        if (assayResultId) {
            const updateAssayResultArgs: AssayResultUpdateArgs = {
                id: assayResultId,
            };
            if (result) {
                updateAssayResultArgs.result = result;
            }
            if (comment) {
                updateAssayResultArgs.comment = comment;
            }
            updateAssayResult(updateAssayResultArgs);
        } else {
            createAssayResult({
                assayId: assayIdBeingEdited,
                result: result,
                comment: comment,
            });
        }
    };

    return (
        <CloseableModal
            title="Edit Assay Result"
            open={isEditingAssay}
            closeFn={() => {
                setIsEditingAssay(false);
            }}
        >
            <Stack gap={1}>
                <TextField
                    label="Result"
                    value={result}
                    onChange={handleChangeNewResult}
                ></TextField>
                <TextField
                    label="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></TextField>
                <ButtonWithLoadingAndError
                    text="Submit"
                    isError={isErrorUpdating || isErrorCreating}
                    isLoading={isLoadingUpdate || isLoadingCreate}
                    error={errorUpdating || errorCreating}
                    onSubmit={handleSubmit}
                />
                <ButtonWithLoadingAndError
                    text="Delete Assay Result"
                    isError={isErrorDeleting}
                    isLoading={isDeleting}
                    error={errorDeleting}
                    onSubmit={() => {
                        if (assayResultId) {
                            deleteAssayResult(assayResultId);
                        }
                    }}
                />
            </Stack>
        </CloseableModal>
    );
};
