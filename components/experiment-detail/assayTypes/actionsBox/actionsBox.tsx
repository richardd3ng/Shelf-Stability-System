import { AssayTypeInfo } from "@/lib/controllers/types";
import { Box, Stack } from "@mui/material";
import React from "react";
import { DeleteAssayTypeIcon } from "./deleteAssayTypeIcon";
import { EditAssayTypeIcon } from "./editAssayTypeIcon";


export const ActionsBox : React.FC<AssayTypeInfo> = (props : AssayTypeInfo ) => {
    return (
        <Box sx={{display : "flex"}}>
            <EditAssayTypeIcon {...props}/>
            <DeleteAssayTypeIcon {...props}/>
            
        </Box>
    )
}