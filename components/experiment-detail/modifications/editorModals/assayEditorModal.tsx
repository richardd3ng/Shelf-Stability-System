import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";
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
import { assayHasResult } from "@/lib/api/validations";
import { updateAssayResult } from "@/lib/controllers/assayResultController";

// TODO: determine how to handle changing weeks + results at the same time, and how to update assay + result
export const AssayEditorModal: React.FC = () => {
    const { isEditing, setIsEditing, assayIdBeingEdited } =
        useContext(AssayEditingContext);
    const experimentId = useExperimentId();
    const { data, isLoading, isError } = useExperimentInfo(experimentId);
    const [newResult, setNewResult] = useState<string | null>(null);
    const [type, setType] = useState<number>(-1);
    const [week, setWeek] = useState<number>(-1);
    const [hasResults, setHasResults] = useState<boolean>(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        const checkIfAssayHasResults = async (assay: Assay) => {
            setHasResults(await assayHasResult(assay.id));
        };
        if (!data) {
            showAlert(
                "error",
                `Experiment ${experimentId} not found or has been deleted`
            );
            return;
        }
        const currAssay = data.assays.find(
            (assay: Assay) => assay.id === assayIdBeingEdited
        );
        if (!currAssay) {
            showAlert(
                "error",
                `Assay being edited is not found or has been deleted`
            );
            return;
        }
        setWeek(currAssay.week);
        setType(currAssay.type);
        checkIfAssayHasResults(currAssay);
    }, [assayIdBeingEdited, data, experimentId]);

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
                    {hasResults && (
                        <TextField
                            label="Week"
                            style={{ marginLeft: 4, marginRight: 4 }}
                            value={week}
                            onChange={(e) => setNewResult(e.target.value)}
                        />
                    )}

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
                                last_editor: "",
                            });
                        }}
                    />
                    {hasResults ? (
                        <Typography>
                            You cannot delete an assay with recorded results
                        </Typography>
                    ) : (
                        <ButtonWithConfirmationLoadingAndError
                            text="Delete Assay"
                            isLoading={isDeleting}
                            isError={isErrorDeleting}
                            error={errorDeleting}
                            onSubmit={() => deleteAssay(assayIdBeingEdited)}
                        />
                    )}
                </Stack>
            </CloseableModal>
        );
    }
};
