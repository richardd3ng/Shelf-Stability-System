import { useMutationToDeleteAssay } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "@/components/shared/confirmationDialog";
import { useState } from "react";

interface DeleteAssayButtonProps {
    id: number;
    type: string;
}

const DeleteAssayButton: React.FC<DeleteAssayButtonProps> = (
    props: DeleteAssayButtonProps
) => {
    const { mutate: deleteAssay } = useMutationToDeleteAssay();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);

    return (
        <>
            <IconButton
                size="small"
                onClick={() => setShowConfirmationDialog(true)}
            >
                <DeleteIcon sx={{ fontSize: 20, color: "gray" }} />
            </IconButton>
            <ConfirmationDialog
                open={showConfirmationDialog}
                text={`Are you sure you want to delete this ${props.type} assay? This action cannot be undone.`}
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() => deleteAssay(props.id)}
            />
        </>
    );
};

export default DeleteAssayButton;
