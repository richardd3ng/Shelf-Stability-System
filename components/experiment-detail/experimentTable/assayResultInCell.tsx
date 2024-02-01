import React from "react";
import { AssayComponentProps } from "./experimentTable";
import { Typography } from "@mui/material";



export const AssayResultInCell : React.FC<AssayComponentProps> = (props : AssayComponentProps) => {
    return (
        <Typography align="center">{props.assay.result}</Typography>
    )
}