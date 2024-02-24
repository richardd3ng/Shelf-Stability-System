import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToCreateAssayResult } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import {
    useMutationToUpdateAssay,
    useMutationToUpdateAssayResult,
} from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import CloseableModal from "@/components/shared/closeableModal";
import { Assay, AssayResult } from "@prisma/client";
import EditableTextField from "@/components/shared/editableTextField";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { INVALID_ASSAY_RESULT_ID } from "@/lib/api/apiHelpers";
import {
    assayTypeIdToName,
    assayTypeNameToId,
    getAssayTypeUnits,
} from "@/lib/controllers/assayTypeController";
import { getDistinctAssayTypes } from "@/lib/controllers/assayTypeController";
import { getErrorMessage } from "@/lib/api/apiHelpers";

interface EditingState {
    isEditingType: boolean;
    isEditingWeek: boolean;
    isEditingResult: boolean;
    isEditingComment: boolean;
}

const INITIAL_EDITING_STATE: EditingState = {
    isEditingType: false,
    isEditingWeek: false,
    isEditingResult: false,
    isEditingComment: false,
};

const AssayEditorModal: React.FC = () => {
    const {
        isEditing: isEditingAssay,
        setIsEditing: setIsEditingAssay,
        id: assayIdBeingEdited,
    } = useContext(AssayEditingContext);
    const { id: assayResultIdBeingEdited } = useContext(
        AssayResultEditingContext
    );
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const [type, setType] = useState<string>("");
    const [week, setWeek] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [editingState, setEditingState] = useState<EditingState>(
        INITIAL_EDITING_STATE
    );

    const startEditing = (field: keyof EditingState) => {
        setEditingState({
            ...INITIAL_EDITING_STATE,
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
        setWeek(currAssay.week.toString());
        setType(assayTypeIdToName(currAssay.type));
        const currAssayResult: AssayResult | undefined = data.assayResults.find(
            (result) => result.assayId === currAssay.id
        );
        if (!currAssayResult) {
            return;
        }
        setResult(
            currAssayResult.result ? currAssayResult.result.toString() : ""
        );
        setComment(currAssayResult.comment ? currAssayResult.comment : "");
    }, [data, assayIdBeingEdited, isEditingAssay]);

    const { mutate: updateAssay } = useMutationToUpdateAssay();
    const { mutate: createAssayResult } = useMutationToCreateAssayResult();
    const { mutate: updateAssayResult } = useMutationToUpdateAssayResult();

    const handleSubmitWeek = (newWeek: string) => {
        updateAssay({
            id: assayIdBeingEdited,
            week: parseInt(newWeek),
        });
        setEditingState(INITIAL_EDITING_STATE);
        setWeek(newWeek);
    };

    const handleSelectAssayTypeChange = (assayTypeName: string) => {
        updateAssay({
            id: assayIdBeingEdited,
            type: assayTypeNameToId(assayTypeName),
        });
        setType(assayTypeName);
        setEditingState(INITIAL_EDITING_STATE);
    };

    const handleSubmitResult = (newResult: string) => {
        if (assayResultIdBeingEdited !== INVALID_ASSAY_RESULT_ID) {
            updateAssayResult({
                id: assayResultIdBeingEdited,
                result: newResult ? parseFloat(newResult) : null,
                last_editor: "rld39",
            });
        } else if (newResult) {
            createAssayResult({
                assayId: assayIdBeingEdited,
                result: parseFloat(newResult),
                comment: null,
                last_editor: "rld39",
            });
        }
        setResult(newResult);
        setEditingState(INITIAL_EDITING_STATE);
    };

    const handleSubmitComment = (newComment: string) => {
        if (assayResultIdBeingEdited !== INVALID_ASSAY_RESULT_ID) {
            updateAssayResult({
                id: assayResultIdBeingEdited,
                comment: newComment ? newComment : null,
                last_editor: "rld39",
            });
        } else if (newComment) {
            createAssayResult({
                assayId: assayIdBeingEdited,
                result: null,
                comment: newComment,
                last_editor: "rld39",
            });
        }
        setComment(newComment);
        setEditingState(INITIAL_EDITING_STATE);
    };

    const handleClose = () => {
        setEditingState(INITIAL_EDITING_STATE);
        setIsEditingAssay(false);
    };

    if (!data || !type || !week) {
        return <></>;
    }
    return (
        <CloseableModal
            open={isEditingAssay}
            hideBackdrop
            closeFn={handleClose}
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
                        value={type}
                        label="Assay Type"
                        onOpen={() => startEditing("isEditingType")}
                        onChange={(e) =>
                            handleSelectAssayTypeChange(e.target.value)
                        }
                        onClose={() => setEditingState(INITIAL_EDITING_STATE)}
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
                    onSubmit={handleSubmitWeek}
                    onEdit={() => startEditing("isEditingWeek")}
                    isEditing={editingState["isEditingWeek"]}
                />
                <EditableTextField
                    value={result?.toString()}
                    defaultDisplayValue="N/A"
                    label="Result:"
                    numberType="float"
                    units={getAssayTypeUnits(type)}
                    onSubmit={handleSubmitResult}
                    onEdit={() => startEditing("isEditingResult")}
                    isEditing={editingState["isEditingResult"]}
                />
                <EditableTextField
                    value={comment?.toString()}
                    defaultDisplayValue="N/A"
                    label="Comment:"
                    multiline
                    onSubmit={handleSubmitComment}
                    onEdit={() => startEditing("isEditingComment")}
                    isEditing={editingState["isEditingComment"]}
                />
            </Stack>
        </CloseableModal>
    );
};

export default AssayEditorModal;
