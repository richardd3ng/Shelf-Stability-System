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
    getAssayTypeUnits,
} from "@/lib/controllers/assayTypeController";
import { EditGroup } from "@/lib/context/shared/editGroup";
import { EditGroupSelect } from "@/components/shared/editGroupSelect";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { AssayTypeInfo } from "@/lib/controllers/types";

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
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    const { assayResult } = useContext(
        AssayResultEditingContext
    );
    const INVALID_ASSAY_TYPE_ID = -1;
    const [assayTypeId, setAssayTypeId] = useState<number>(INVALID_ASSAY_TYPE_ID);
    const [week, setWeek] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const { user } = useContext(CurrentUserContext);

    useEffect(() => {
        if (!isEditingAssay || assay === undefined || !experimentInfo) {
            return;
        }
        setWeek(assay.week.toString());
        setAssayTypeId(assay.assayTypeId);
        setResult(assayResult?.result?.toString() ?? "");
        setComment(assayResult?.comment ?? "");
    }, [assay, assayResult, isEditingAssay, experimentInfo]);

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

    const handleSelectAssayTypeChange = (assayTypeId : number) => {
        updateAssay({
            id: assay!.id,
            assayTypeId: assayTypeId
        });
        if (experimentInfo){
            const correspondingTypes = experimentInfo.assayTypes.filter((type) => type.assayType.id === assayTypeId)
            if (correspondingTypes.length > 0){
                setAssayTypeId(correspondingTypes[0].id);
            }
        }
    };

    const handleSubmitResult = (newResult: string) => {
        if (assayResult !== undefined) {
            updateAssayResult({
                id: assayResult.id,
                result: newResult ? parseFloat(newResult) : null,
                author: user?.username ?? INVALID_USERNAME,
            });
        } else if (newResult) {
            createAssayResult({
                assayId: assay!.id,
                result: parseFloat(newResult),
                comment: null,
                author: user?.username ?? INVALID_USERNAME,
            });
        }
        setResult(newResult);
    };

    const handleSubmitComment = (newComment: string) => {
        if (assayResult !== undefined) {
            updateAssayResult({
                id: assayResult.id,
                comment: newComment ? newComment : null,
                author: user?.username ?? INVALID_USERNAME,
            });
        } else if (newComment) {
            createAssayResult({
                assayId: assay!.id,
                result: null,
                comment: newComment,
                author: user?.username ?? INVALID_USERNAME,
            });
        }
        setComment(newComment);
    };

    const handleClose = () => {
        setComment("");
        setResult("");
        setWeek("");
        setAssayTypeId(INVALID_ASSAY_TYPE_ID);
        setIsEditingAssay(false);
        onClose?.();
    };

    if (!assay || !user || assayTypeId <= INVALID_ASSAY_TYPE_ID || !week || !experimentInfo) {
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
                                    value={assayTypeId}
                                    label="Assay Type"
                                    onChange={(e) =>
                                        handleSelectAssayTypeChange(Number(e.target.value))
                                    }
                                >
                                    {experimentInfo.assayTypes.map((type: AssayTypeInfo) => (
                                        <MenuItem key={type.id} value={type.assayType.id}>
                                            {type.assayType.name}
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
                        units={getAssayTypeUnits(assayTypeId, experimentInfo.assayTypes)}
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
