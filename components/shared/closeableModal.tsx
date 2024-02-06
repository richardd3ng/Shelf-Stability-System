import React, { ReactNode } from "react";
import { Dialog, DialogTitle, Typography, IconButton } from "@mui/material";
import {Close} from "@mui/icons-material"

interface CloseableModalProps {
    open : boolean;
    closeFn : () => void;
    children : ReactNode;
    title : string;
}

export const CloseableModal : React.FC<CloseableModalProps> = (props : CloseableModalProps) => {
    return (
        <Dialog open={props.open}>
            <DialogTitle>
                <Typography style={{marginLeft : 8, marginRight : 8, marginBottom : 8, marginTop : 8}}>{props.title}</Typography>
                <IconButton aria-label="close"
                    onClick={props.closeFn}
                    sx={{ position: 'absolute', right: 8, top: 8, color: 'red' }}>
                    <Close/>
                </IconButton>
            </DialogTitle>
            {props.children}
        </Dialog>
    )
}
