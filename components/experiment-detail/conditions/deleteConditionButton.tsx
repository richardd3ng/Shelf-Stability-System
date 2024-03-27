import { useMutationToDeleteCondition } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { IconButton } from "@mui/material";
import Delete from "@mui/icons-material/Delete";

interface DeleteConditionButtonProps {
    id: number;
}

const DeleteConditionButton: React.FC<DeleteConditionButtonProps> = (
    props: DeleteConditionButtonProps
) => {
    const { mutate: deleteCondition } = useMutationToDeleteCondition();

    return (
        <IconButton
            size="small"
            sx={{ marginLeft: -1 }}
            onClick={() => deleteCondition(props.id)}
        >
            <Delete sx={{ fontSize: 20 }} />
        </IconButton>
    );
};

export default DeleteConditionButton;
