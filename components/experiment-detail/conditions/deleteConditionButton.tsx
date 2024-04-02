import { useMutationToDeleteCondition } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { IconButton } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import ConfirmationDialog from "@/components/shared/confirmationDialog";
import { useState } from "react";
import { deleteCondition } from "@/lib/controllers/conditionController";
import { useAlert } from "@/lib/context/shared/alertContext";
import { ApiError } from "next/dist/server/api-utils";
import { CONFIRMATION_REQUIRED_MESSAGE } from "@/lib/api/error";

interface DeleteConditionButtonProps {
    id: number;
    name: string;
}

const DeleteConditionButton: React.FC<DeleteConditionButtonProps> = (
    props: DeleteConditionButtonProps
) => {
    const { mutate: deleteConditionMutationFn } =
        useMutationToDeleteCondition();
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);
    const { showAlert } = useAlert();

    const onClick = async () => {
        try {
            await deleteCondition(props.id, false);
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
            <IconButton size="small" sx={{ marginLeft: -1 }} onClick={onClick}>
                <Delete sx={{ fontSize: 20 }} />
            </IconButton>
            <ConfirmationDialog
                open={showConfirmationDialog}
                text={`Are you sure you want to delete condition ${props.name}? This action cannot be undone.`}
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() =>
                    deleteConditionMutationFn({ id: props.id, confirm: true })
                }
            />
        </>
    );
};

export default DeleteConditionButton;
