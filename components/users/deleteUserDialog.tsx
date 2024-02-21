import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
interface DeleteUserDialogProps {
    open: boolean;
    ownedExperiments: string[];
    onClose: () => void;
    onDelete: () => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = (
    props: DeleteUserDialogProps
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
                    Are you sure you want to delete this user?

                    <br />

                    {props.ownedExperiments.length > 0 &&
                        (<>
                            {props.ownedExperiments.length == 1
                                ? "The following experiment will have its owner changed to 'admin'"
                                : "The following experiments will have their owners changed to 'admin'"
                            }
                            <div style={{
                                maxHeight: 150,
                                overflow: 'auto',
                                border: '1px solid lightgray',
                                backgroundColor: '#f5f5f5',
                                padding: 5
                            }}>
                                {props.ownedExperiments.map((exp) => (
                                    <p>{exp}</p>
                                ))}
                            </div>
                        </>)
                    }

                    This action cannot be undone.
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
