import React, { useContext } from "react";
import { AssayComponentProps} from "./experimentTable";
import { Button, Typography } from "@mui/material";

import { AssayEditingContext } from "@/lib/context/assayEditingContext";
import { Assay, AssayType } from "@prisma/client";

export const AssayButtonInCell : React.FC<AssayComponentProps> = (props : AssayComponentProps) => {
    const {setIsEditing, setAssayIdBeingEdited} = useContext(AssayEditingContext);
    return (
        <Button variant="contained" key={props.assay.id} style={{marginBottom : 2}} onClick={() => {
            setAssayIdBeingEdited(props.assay.id);
            setIsEditing(true);
        }}>
            <Typography key={props.assay.id}>
                {getNameForAssay(props.assay, props.experimentInfo.assayTypes)}
            </Typography>
        </Button>
    )
}

export const getNameForAssay = (assay : Assay, assayTypes : AssayType[]) : string => {
    let correspondingType = assayTypes.find(a => a.id === assay.typeId);
    if (correspondingType){
        return correspondingType.name;
    } else {
        return "?";
    }
}