import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToCreateAssayResult } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import {
    useMutationToUpdateAssay,
    useMutationToUpdateAssayResult,
} from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Stack,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import CloseableModal from "@/components/shared/closeableModal";
import EditableTextField from "@/components/shared/editableTextField";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { INVALID_USERNAME } from "@/lib/hooks/useUserInfo";
import {
    assayTypeIdToName,
    assayTypeNameToId,
    getAssayTypeUnits,
} from "@/lib/controllers/assayTypeController";
import { getDistinctAssayTypes } from "@/lib/controllers/assayTypeController";
import { EditGroup } from "@/lib/context/shared/editGroup";
import { EditGroupSelect } from "@/components/shared/editGroupSelect";

export interface AssayEditorModalProps {
    onlyEditResult?: boolean;
    onClose?: () => void;
}

const AssayEditorModal: React.FC<AssayEditorModalProps> = ({ onlyEditResult, onClose }) => {
    const {
        isEditing: isEditingAssay,
        setIsEditing: setIsEditingAssay,
        assay,
    } = useContext(AssayEditingContext);
    const { assayResult } = useContext(
        AssayResultEditingContext
    );
    const [type, setType] = useState<string>("");
    const [week, setWeek] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const { user } = useContext(CurrentUserContext);

    useEffect(() => {
        if (!isEditingAssay || assay === undefined) {
            return;
        }
        setWeek(assay.week.toString());
        setType(assayTypeIdToName(assay.type));
        setResult(assayResult?.result?.toString() ?? "");
        setComment(assayResult?.comment ?? "");
    }, [assay, assayResult, isEditingAssay]);

    const { mutate: updateAssay } = useMutationToUpdateAssay();
    const { mutate: createAssayResult } = useMutationToCreateAssayResult();
    const { mutate: updateAssayResult } = useMutationToUpdateAssayResult();

    const handleSubmitWeek = (newWeek: string) => {
        updateAssay({
            id: assay!.id,
            week: parseInt(newWeek),
        });
        setWeek(newWeek);
    };

    const handleSelectAssayTypeChange = (assayTypeName: string) => {
        updateAssay({
            id: assay!.id,
            type: assayTypeNameToId(assayTypeName),
        });
        setType(assayTypeName);
    };

    const handleSubmitResult = (newResult: string) => {
        if (assayResult !== undefined) {
            updateAssayResult({
                id: assayResult.id,
                result: newResult ? parseFloat(newResult) : null,
                last_editor: user?.username ?? INVALID_USERNAME,
            });
        } else if (newResult) {
            createAssayResult({
                assayId: assay!.id,
                result: parseFloat(newResult),
                comment: null,
                last_editor: user?.username ?? INVALID_USERNAME,
            });
        }
        setResult(newResult);
    };

    const handleSubmitComment = (newComment: string) => {
        if (assayResult !== undefined) {
            updateAssayResult({
                id: assayResult.id,
                comment: newComment ? newComment : null,
                last_editor: user?.username ?? INVALID_USERNAME,
            });
        } else if (newComment) {
            createAssayResult({
                assayId: assay!.id,
                result: null,
                comment: newComment,
                last_editor: user?.username ?? INVALID_USERNAME,
            });
        }
        setComment(newComment);
    };

    const handleClose = () => {
        setComment("");
        setResult("");
        setWeek("");
        setType("");
        setIsEditingAssay(false);
        onClose?.();
    };

    if (!assay || !user || !type || !week) {
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
                <EditGroup
                    editable={isEditingAssay}
                >
                    {onlyEditResult ? null : (
                        <>
                            <FormControl fullWidth>
                                <InputLabel id="Assay Type Select Label">
                                    Assay Type
                                </InputLabel>
                                <EditGroupSelect
                                    id="assayType"
                                    labelId="Assay Type Select Label"
                                    value={type}
                                    label="Assay Type"
                                    onChange={(e) =>
                                        handleSelectAssayTypeChange(e.target.value)
                                    }
                                >
                                    {getDistinctAssayTypes().map((type: string) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </EditGroupSelect>
                            </FormControl>
                            <EditableTextField
                                id="week"
                                value={week?.toString()}
                                label="Week:"
                                numberType="whole number"
                                onSubmit={handleSubmitWeek}
                            />
                        </>)}
                    <EditableTextField
                        id="result"
                        value={result?.toString()}
                        defaultDisplayValue="N/A"
                        label="Result:"
                        numberType="float"
                        units={getAssayTypeUnits(type)}
                        onSubmit={handleSubmitResult}
                    />
                    <EditableTextField
                        id="comment"
                        value={comment?.toString()}
                        defaultDisplayValue="N/A"
                        label="Comment:"
                        multiline
                        onSubmit={handleSubmitComment}
                    />
                </EditGroup>
            </Stack>
        </CloseableModal>
    );
};

export default AssayEditorModal;
