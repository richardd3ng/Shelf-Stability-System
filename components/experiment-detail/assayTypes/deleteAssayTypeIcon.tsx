import React, {useState} from "react"
import Delete from "@mui/icons-material/Delete";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import { useMutationToDeleteAssayTypeForExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { AssayTypeInfo } from "@/lib/controllers/types";
import ConfirmationDialog from "@/components/shared/confirmationDialog";
export const DeleteAssayTypeIcon : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {mutate : deleteAssayType} = useMutationToDeleteAssayTypeForExperiment();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
    return (
        <>
            <IconButtonWithTooltip
                text="Delete"
                icon={Delete}
                onClick={() => {setShowConfirmationDialog(true)}}
            />
            <ConfirmationDialog
                open={showConfirmationDialog}
                text="Are you sure you want to delete this assay type?"
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() => deleteAssayType(props.id)}
            />

        </>

    )
}