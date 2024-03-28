import { useMutationToDeleteCondition } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { IconButton } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import ConfirmationDialog from "@/components/shared/confirmationDialog";
import { useState } from "react";

interface DeleteConditionButtonProps {
    id: number;
    name: string;
}

const DeleteConditionButton: React.FC<DeleteConditionButtonProps> = (
    props: DeleteConditionButtonProps
) => {
    const { mutate: deleteCondition } = useMutationToDeleteCondition();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);

    return (
        <>
            <IconButton
                size="small"
                sx={{ marginLeft: -1 }}
                onClick={() => setShowConfirmationDialog(true)}
            >
                <Delete sx={{ fontSize: 20 }} />
            </IconButton>
            <ConfirmationDialog
                open={showConfirmationDialog}
                text={`Are you sure you want to delete condition ${props.name}? This action cannot be undone.`}
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() => deleteCondition(props.id)}
            />
        </>
    );
};

export default DeleteConditionButton;
