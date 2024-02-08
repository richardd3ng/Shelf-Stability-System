import React from "react";
import { AssayComponentProps } from "./experimentTable";
import { Typography } from "@mui/material";



export const AssayResultInCell : React.FC<AssayComponentProps> = (props : AssayComponentProps) => {
    return (
        <Typography align="center" color={props.assay.result ? "green" : "black"}>
            {props.assay.result ? props.assay.result : "Not Recorded"}
        </Typography>
    )
}