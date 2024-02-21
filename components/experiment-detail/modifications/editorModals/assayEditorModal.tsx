import { AssayEditingContext } from "@/lib/context/shared/assayEditingContext";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToCreateAssayResult } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import {
    useMutationToUpdateAssay,
    useMutationToUpdateAssayResult,
} from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useMutationToDeleteAssayResult } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { CloseableModal } from "@/components/shared/closeableModal";
import { Assay, AssayResult } from "@prisma/client";
import { AssayResultUpdateArgs } from "@/lib/controllers/types";
import EditableTextField from "@/components/shared/editableTextField";
import { AssayResultEditingContext } from "@/lib/context/shared/assayResultEditingContext";
import { INVALID_ASSAY_RESULT_ID } from "@/lib/api/apiHelpers";
import { useAlert } from "@/lib/context/alert-context";
import { getAssayTypeUnits } from "@/lib/controllers/assayTypeController";

export const AssayEditorModal: React.FC = () => {
    const {
        isEditing: isEditingAssay,
        setIsEditing: setIsEditingAssay,
        assayIdBeingEdited,
    } = useContext(AssayEditingContext);
    const {
        isEditing: isEditingAssayResult,
        setIsEditing: setIsEditingAssayResult,
        assayResultIdBeingEdited,
        setAssayResultIdBeingEdited,
    } = useContext(AssayResultEditingContext);
    const experimentId = useExperimentId();
    const { data, isLoading, isError } = useExperimentInfo(experimentId);
    const [result, setResult] = useState<number | null>(null);
    const [comment, setComment] = useState<string | null>(null);
    const [type, setType] = useState<number>(-1);
    const [week, setWeek] = useState<number>(-1);

    useEffect(() => {
        if (!data) {
            return;
        }
        const currAssay: Assay | undefined = data.assays.find(
            (assay: Assay) => assay.id === assayIdBeingEdited
        );
        if (!currAssay) {
            return;
        }
        setWeek(currAssay.week);
        setType(currAssay.type);
        const currAssayResult: AssayResult | undefined = data.assayResults.find(
            (result) => result.assayId === currAssay.id
        );
        if (!currAssayResult) {
            return;
        }
        setResult(currAssayResult.result);
        setComment(currAssayResult.comment);
    }, [data, assayIdBeingEdited, isEditingAssay]);

    const { mutate: updateAssay } = useMutationToUpdateAssay();
    const { mutate: createAssayResult } = useMutationToCreateAssayResult();
    const { mutate: updateAssayResult } = useMutationToUpdateAssayResult();
    const { mutate: deleteAssayResult } = useMutationToDeleteAssayResult();

    const handleSubmit = () => {
        if (result) {
            if (assayResultIdBeingEdited !== INVALID_ASSAY_RESULT_ID) {
                const updateAssayResultArgs: AssayResultUpdateArgs = {
                    id: assayResultIdBeingEdited,
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
        }
        setIsEditingAssayResult(false);
    };

    return (
        <CloseableModal
            open={isEditingAssay}
            hideBackdrop
            closeFn={() => setIsEditingAssay(false)}
            title="Edit Assay"
        >
            <Stack>
                <Stack style={{ marginBottom: 8, marginRight: 4 }}>
                    <EditableTextField
                        value={result?.toString()}
                        defaultDisplayValue="N/A"
                        label="Result:"
                        numberType="float"
                        units={type !== -1 ? getAssayTypeUnits(type) : ""}
                        onChange={(value: string) =>
                            setResult(parseFloat(value))
                        }
                        onSubmit={handleSubmit}
                    />
                </Stack>
            </Stack>
        </CloseableModal>
    );
};
