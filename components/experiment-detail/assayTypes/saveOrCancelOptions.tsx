import { Button, Stack, TextField, IconButton } from "@mui/material";
import Check from "@mui/icons-material/Check";
import { Cancel } from "@mui/icons-material";
import React, {useState, useEffect} from "react";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { InitialTextDisplay } from "./initialTextDisplay";

interface SaveOrCancelOptionsProps {
    onSave : () => void;
    onCancel : () => void;
}

export const SaveOrCancelOptions : React.FC<SaveOrCancelOptionsProps> = (props : SaveOrCancelOptionsProps) => {
    return (
        <Stack direction="row">
            <IconButton onClick={() => props.onSave()}>
                <Check/>
            </IconButton>
            <IconButton onClick={() => props.onCancel()}>
                <Cancel/>
            </IconButton>
        </Stack>
    )

}