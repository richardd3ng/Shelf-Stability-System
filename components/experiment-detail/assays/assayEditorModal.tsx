import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import React, { useContext } from "react";
import CloseableModal from "@/components/shared/closeableModal";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import AssayEditForm from "./assayEditForm";
import { Box } from "@mui/material";

export interface AssayEditorModalProps {
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

    const handleClose = () => {
        setIsEditingAssay(false);
        props.onClose?.();
    };

    if (
        !assay ||
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
            <Box paddingBottom={2}>
                <AssayEditForm
                    experimentId={experimentInfo.experiment.id}
                    assayId={assay.id}
                />
            </Box>
        </CloseableModal>
    );
};

export default AssayEditorModal;
