import { Button, Stack, TextField, Typography, IconButton } from "@mui/material";
import Check from "@mui/icons-material/Check";
import { Cancel } from "@mui/icons-material";
import React, {useState, useEffect} from "react";

interface EditableTableCellProps {
    initialText : string;
    saveText : (s : string) => void;
}

export const EditableTableCell : React.FC<EditableTableCellProps> = (props : EditableTableCellProps) => {
    const [cellValue, setCellValue] = useState<string>("");
    useEffect(() => {
        setCellValue(props.initialText);
    }, [props.initialText]);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    if (isEditing){
        return (
            <Stack direction="row">
                <TextField value={cellValue} onChange={(e) => setCellValue(e.target.value)}>
    
                </TextField>

                <IconButton onClick={() => {
                    props.saveText(cellValue);
                    setIsEditing(false);
                }}>
                    <Check/>
                </IconButton>
                <IconButton onClick={() => {
                    setCellValue(props.initialText);
                    setIsEditing(false);
                    
                }}>
                    <Cancel/>
                </IconButton>
            </Stack>
            
        )
    } else {
        return (
            <Button  onClick={() => setIsEditing(true)}>
                <Typography style={{cursor : "pointer", width : "100%", textTransform : "none"}} >
                    {cellValue}
                </Typography>
            </Button>
        )
    }

    
}