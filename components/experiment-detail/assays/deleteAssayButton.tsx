import { useMutationToDeleteAssay } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "@/components/shared/confirmationDialog";
import { useState } from "react";
import { deleteAssay } from "@/lib/controllers/assayController";
import { useAlert } from "@/lib/context/shared/alertContext";
import { ApiError } from "next/dist/server/api-utils";
import { CONFIRMATION_REQUIRED_MESSAGE } from "@/lib/api/error";

interface DeleteAssayButtonProps {
    id: number;
    type: string;
}

const DeleteAssayButton: React.FC<DeleteAssayButtonProps> = (
    props: DeleteAssayButtonProps
) => {
    const { mutate: deleteAssayMutationFn } = useMutationToDeleteAssay();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);
    const { showAlert } = useAlert();

    const onClick = async () => {
        try {
            await deleteAssay(props.id, false);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.message === CONFIRMATION_REQUIRED_MESSAGE) {
                    setShowConfirmationDialog(true);
                } else {
                    showAlert("error", error.message);
                }
            }
        }
    };

    return (
        <>
            <IconButton size="small" onClick={onClick}>
                <DeleteIcon sx={{ fontSize: 20, color: "gray" }} />
            </IconButton>
            <ConfirmationDialog
                open={showConfirmationDialog}
                text={`Are you sure you want to delete this ${props.type} assay? This action cannot be undone.`}
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() =>
                    deleteAssayMutationFn({ id: props.id, confirm: true })
                }
            />
        </>
    );
};

export default DeleteAssayButton;
