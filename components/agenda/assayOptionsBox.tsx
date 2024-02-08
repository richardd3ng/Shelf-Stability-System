import React, { useContext } from "react";
import Link from "next/link";
import { IconButton, Box,  } from "@mui/material";
import ViewIcon from "@mui/icons-material/Visibility";
import { Edit } from "@mui/icons-material";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";

interface AssayOptionsBoxProps{
    experimentId : number;
    assayId : number;
}

export const AssayOptionsBox : React.FC<AssayOptionsBoxProps> = (props : AssayOptionsBoxProps) => {
    const {setIsEditing, setAssayIdBeingEdited} = useContext(AgendaContext);
    return (
        <Box sx={{ display: "flex" }}>
            <IconButton component={Link} href={`experiments/${props.experimentId}`}>
                <ViewIcon />
            </IconButton>
            <IconButton onClick={() => {
                setAssayIdBeingEdited(props.assayId);
                setIsEditing(true);
            }}>
                <Edit />
            </IconButton>
        </Box>
    )
}