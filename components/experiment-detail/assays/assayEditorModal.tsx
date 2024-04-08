import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToCreateAssayResult } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useMutationToUpdateAssayResult } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { Stack, Typography } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import CloseableModal from "@/components/shared/closeableModal";
import EditableTextField from "@/components/shared/editableTextField";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { getAssayTypeUnits } from "@/lib/controllers/assayTypeController";
import { Button, FormControl, TextField } from "@mui/material";

export interface AssayEditorModalProps {
    onlyEditResult?: boolean;
    showFullContext?: boolean;
    onClose?: () => void;
}

const AssayEditorModal: React.FC<AssayEditorModalProps> = (
    props: AssayEditorModalProps
) => {
    const {
        isEditing: isEditingAssay,
        setIsEditing: setIsEditingAssay,
        assay,
    } = useContext(AssayEditingContext);
    const { data: experimentInfo } = useExperimentInfo(
        assay?.experimentId ?? -1
    );
    const { assayResult } = useContext(AssayResultEditingContext);
    const INVALID_ASSAY_TYPE_ID = -1;
    const [assayTypeId, setAssayTypeId] = useState<number>(
        INVALID_ASSAY_TYPE_ID
    );
    const [value, setValue] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const { user } = useContext(CurrentUserContext);
    const { mutate: createAssayResult } = useMutationToCreateAssayResult();
    const { mutate: updateAssayResult } = useMutationToUpdateAssayResult();

    useEffect(() => {
        if (!isEditingAssay || assay === undefined || !experimentInfo) {
            return;
        }
        setAssayTypeId(assay.assayTypeId);
        setValue(assayResult?.result?.toString() ?? "");
        setComment(assayResult?.comment ?? "");
    }, [assay, assayResult, isEditingAssay, experimentInfo]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const author = `${user?.displayName} (${user?.username})`;
        if (assayResult !== undefined) {
            updateAssayResult({
                id: assayResult.id,
                result: value ? parseFloat(value) : null,
                comment: comment !== "" ? comment : null,
                author: author,
            });
        } else if (value || comment) {
            createAssayResult({
                assayId: assay!.id,
                result: value ? parseFloat(value) : null,
                comment: comment !== "" ? comment : null,
                author: author,
            });
        }
    };

    const handleClose = () => {
        setComment("");
        setValue("");
        setAssayTypeId(INVALID_ASSAY_TYPE_ID);
        setIsEditingAssay(false);
        props.onClose?.();
    };

    if (
        !assay ||
        !user ||
        assayTypeId <= INVALID_ASSAY_TYPE_ID ||
        !experimentInfo
    ) {
        return null;
    }

    return (
        <CloseableModal
            open={isEditingAssay}
            hideBackdrop
            closeFn={handleClose}
            title="Edit Assay Result"
        >
            <form onSubmit={handleSubmit}>
                <Stack style={{ marginBottom: 8, marginRight: 4 }} spacing={1}>
                    <TextField
                        label={`Value (${getAssayTypeUnits(
                            assayTypeId,
                            experimentInfo.assayTypes
                        )})`}
                        style={{ marginLeft: 4, marginRight: 4 }}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <TextField
                        label="Comment"
                        style={{ marginLeft: 4, marginRight: 4 }}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ textTransform: "none" }}
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </CloseableModal>
    );
};

export default AssayEditorModal;
