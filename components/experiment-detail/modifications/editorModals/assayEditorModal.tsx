import { AssayEditingContext } from "@/lib/context/shared/assayEditingContext";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import {
    useMutationToUpdateAssay,
    useMutationToUpdateAssayResult,
} from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { TextField, Stack, Typography } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { ButtonWithConfirmationLoadingAndError } from "@/components/shared/buttonWithConfirmationLoadingAndError";
import {
    useMutationToDeleteAssay,
    useMutationToDeleteAssayResult,
} from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { CloseableModal } from "@/components/shared/closeableModal";
import { Assay } from "@prisma/client";
import { useAlert } from "@/lib/context/alert-context";
import { updateAssayResult } from "@/lib/controllers/assayResultController";

export const AssayEditorModal: React.FC = () => {
    const { isEditing, setIsEditing, assayIdBeingEdited } =
        useContext(AssayEditingContext);
    const experimentId = useExperimentId();
    const { data, isLoading, isError } = useExperimentInfo(experimentId);
    const [newResult, setNewResult] = useState<string | null>(null);
    const [type, setType] = useState<number>(-1);
    const [week, setWeek] = useState<number>(-1);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (!data) {
            return;
        }
        const currAssay = data.assays.find(
            (assay: Assay) => assay.id === assayIdBeingEdited
        );
        if (!currAssay) {
            return;
        }
        setWeek(currAssay.week);
        setType(currAssay.type);
    }, [data, assayIdBeingEdited, isEditing]);

    const {
        mutate: deleteAssay,
        isPending: isDeleting,
        isError: isErrorDeleting,
        error: errorDeleting,
    } = useMutationToDeleteAssay();
    const {
        mutate: deleteAssayResult,
        isPending: isDeletingResult,
        isError: isErrorDeletingResult,
        error: errorDeletingResult,
    } = useMutationToDeleteAssayResult();
    const {
        mutate: updateAssay,
        isPending: isUpdatingDB,
        isError: isErrorUpdatingDB,
        error: errorUpdatingAssay,
    } = useMutationToUpdateAssay();

    if (!isEditing || isError || isLoading || !data) {
        return null;
    } else {
        return (
            <CloseableModal
                open={isEditing}
                closeFn={() => setIsEditing(false)}
                title="Edit Assay"
            >
                <Stack direction="column">
                    <Stack
                        direction="row"
                        style={{ marginBottom: 8, marginRight: 4 }}
                    >
                        <TextField
                            label="Result"
                            style={{ marginLeft: 4, marginRight: 4 }}
                            //type="number"
                            value={newResult}
                            onChange={(e) => setNewResult(e.target.value)}
                        />
                        <ButtonWithLoadingAndError
                            text="Delete Result"
                            isLoading={isDeletingResult}
                            isError={isErrorDeletingResult}
                            error={errorDeletingResult}
                            onSubmit={() =>
                                deleteAssayResult(assayIdBeingEdited)
                            }
                        />
                    </Stack>
                    <TextField
                        label="Week"
                        style={{ marginLeft: 4, marginRight: 4 }}
                        value={week}
                        onChange={(e) => setWeek(parseInt(e.target.value))}
                    />

                    <ButtonWithLoadingAndError
                        text="Submit New Result"
                        isError={isErrorUpdatingDB}
                        isLoading={isUpdatingDB}
                        error={errorUpdatingAssay}
                        onSubmit={async () => {
                            await updateAssay({
                                id: assayIdBeingEdited,
                                type: type,
                            });
                            await updateAssayResult({
                                id: assayIdBeingEdited,
                            });
                        }}
                    />
                    <ButtonWithConfirmationLoadingAndError
                        text="Delete Assay"
                        isLoading={isDeleting}
                        isError={isErrorDeleting}
                        error={errorDeleting}
                        onSubmit={() => deleteAssay(assayIdBeingEdited)}
                    />
                </Stack>
            </CloseableModal>
        );
    }
};
