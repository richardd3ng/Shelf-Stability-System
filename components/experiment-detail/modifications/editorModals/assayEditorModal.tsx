import { AssayEditingContext } from "@/lib/context/shared/assayEditingContext";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToCreateAssayResult } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import {
    useMutationToUpdateAssay,
    useMutationToUpdateAssayResult,
} from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useMutationToDeleteAssayResult } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { CloseableModal } from "@/components/shared/closeableModal";
import { Assay, AssayResult } from "@prisma/client";
import { AssayResultUpdateArgs } from "@/lib/controllers/types";
import EditableTextField from "@/components/shared/editableTextField";
import { AssayResultEditingContext } from "@/lib/context/shared/assayResultEditingContext";
import { INVALID_ASSAY_RESULT_ID } from "@/lib/api/apiHelpers";
import {
    assayTypeIdToName,
    assayTypeNameToId,
    getAssayTypeUnits,
} from "@/lib/controllers/assayTypeController";
import { getDistinctAssayTypes } from "@/lib/controllers/assayTypeController";
import { LoadingContainer } from "@/components/shared/loading";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";

interface EditingState {
    isEditingType: boolean;
    isEditingWeek: boolean;
    isEditingResult: boolean;
    isEditingComment: boolean;
}

const initialEditingState: EditingState = {
    isEditingType: false,
    isEditingWeek: false,
    isEditingResult: false,
    isEditingComment: false,
};

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
    const { data, isLoading, isError, error } = useExperimentInfo(experimentId);
    const [type, setType] = useState<number>(-1);
    const [week, setWeek] = useState<number>(-1);
    const [result, setResult] = useState<number | null>(null);
    const [comment, setComment] = useState<string | null>(null);
    const [editingState, setEditingState] =
        useState<EditingState>(initialEditingState);

    const startEditing = (field: keyof EditingState) => {
        setEditingState({
            ...initialEditingState,
            [field]: true,
        });
    };

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
    const handleEditWeek = () => {
        updateAssay({
            id: assayIdBeingEdited,
            week: week,
        });
        setEditingState(initialEditingState);
    };

    const handleSelectAssayTypeChange = (assayTypeName: string) => {
        const typeId: number = assayTypeNameToId(assayTypeName);
        setType(typeId);
        updateAssay({
            id: assayIdBeingEdited,
            type: typeId,
        });
        setEditingState(initialEditingState);
    };

    const handleEditAssayResult = () => {
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
        } else {
            // handleDelete();
        }
        setEditingState(initialEditingState);
    };

    // const handleDelete = () => {
    //     if (assayResultIdBeingEdited !== INVALID_ASSAY_RESULT_ID) {
    //         deleteAssayResult(assayResultIdBeingEdited);
    //     }
    // };
    if (type === -1 || week === -1) {
        return <></>;
    }
    if (isLoading) {
        return <LoadingContainer />;
    } else if (isError || !data) {
        return <ErrorMessage message={getErrorMessage(error)} />;
    }
    return (
        <CloseableModal
            open={isEditingAssay}
            hideBackdrop
            closeFn={() => setIsEditingAssay(false)}
            title="Edit Assay"
        >
            <Stack style={{ marginBottom: 8, marginRight: 4 }} spacing={1}>
                <FormControl fullWidth>
                    <InputLabel id="Assay Type Select Label">
                        Assay Type
                    </InputLabel>
                    <Select
                        labelId="Assay Type Select Label"
                        id="Assay Type Selection"
                        value={assayTypeIdToName(type)}
                        label="Assay Type"
                        onOpen={() => startEditing("isEditingType")}
                        onChange={(e) =>
                            handleSelectAssayTypeChange(e.target.value)
                        }
                        onClose={() => setEditingState(initialEditingState)}
                    >
                        {getDistinctAssayTypes().map((type: string) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <EditableTextField
                    value={week?.toString()}
                    label="Week:"
                    numberType="whole number"
                    onSubmit={handleEditWeek}
                    onEdit={() => startEditing("isEditingWeek")}
                    isEditing={editingState["isEditingWeek"]}
                />
                <EditableTextField
                    value={result?.toString()}
                    defaultDisplayValue="N/A"
                    label="Result:"
                    numberType="float"
                    units={getAssayTypeUnits(type)}
                    onSubmit={handleEditAssayResult}
                    onEdit={() => startEditing("isEditingResult")}
                    isEditing={editingState["isEditingResult"]}
                />
                <EditableTextField
                    value={comment?.toString()}
                    defaultDisplayValue="N/A"
                    label="Comment:"
                    multiline
                    onSubmit={handleEditAssayResult}
                    onEdit={() => startEditing("isEditingComment")}
                    isEditing={editingState["isEditingComment"]}
                />
            </Stack>
        </CloseableModal>
    );
};
