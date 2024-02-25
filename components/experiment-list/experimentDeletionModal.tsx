import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
interface ExperimentDeletionDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const ExperimentDeletionDialog: React.FC<ExperimentDeletionDialogProps> = (
    props: ExperimentDeletionDialogProps
) => {
    const handleDelete = () => {
        props.onClose();
        props.onDelete();
    };

    return (
        <Dialog open={props.open}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the selected experiment(s)?
                    Only experiments without recorded assay results can be
                    deleted. This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{ textTransform: "none" }} onClick={props.onClose}>
                    Cancel
                </Button>
                <Button sx={{ textTransform: "none" }} onClick={handleDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExperimentDeletionDialog;
