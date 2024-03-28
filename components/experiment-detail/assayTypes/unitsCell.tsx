import { AssayTypeInfo } from "@/lib/controllers/types";
import { useMutationToUpdateAssayType } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import React from "react";
import { Typography } from "@mui/material";
import { EditableTableCell } from "./editableTableCell";

interface UnitsTextProps{
    units : string | null;
}

const UnitsText : React.FC<UnitsTextProps> = (props : UnitsTextProps) => {
    if (props.units){
        return (
            <Typography style={{cursor : "pointer", width : "100%", textTransform : "none"}} >
                {props.units}
            </Typography>
        )
    } else {
        return (
            <Typography style={{cursor : "pointer", width : "100%", textTransform : "none", color : "gray"}} >
                No Units Yet
            </Typography>
        )
    }
}

export const UnitsCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {mutate : updateAssayType} = useMutationToUpdateAssayType();
    return (
        <Typography >
            <EditableTableCell onlyAdminCanEdit={true} nullDescription="No Units Yet" initialText={props.assayType.units ? props.assayType.units : ""} saveText={(newUnits : string) => {
                updateAssayType({
                    assayTypeId : props.assayType.id,
                    newName : null,
                    newUnits : newUnits
                })
            }}/>
        </Typography>
    )
}