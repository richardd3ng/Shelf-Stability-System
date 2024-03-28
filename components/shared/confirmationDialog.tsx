import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface ConfirmationDialogProps {
    open: boolean;
    text: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (
    props: ConfirmationDialogProps
) => {
    const handleConfirm = () => {
        props.onClose();
        props.onConfirm();
    };

    return (
        <Dialog open={props.open}>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{ textTransform: "none" }} onClick={props.onClose}>
                    Cancel
                </Button>
                <Button sx={{ textTransform: "none" }} onClick={handleConfirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
