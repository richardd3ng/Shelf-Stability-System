import { AssayTypeInfo } from "@/lib/controllers/types";
import { useMutationToUpdateAssayType } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import React from "react";
import { Typography } from "@mui/material";
import { EditableTableCell } from "./editableTableCell";



export const UnitsCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {mutate : updateAssayType} = useMutationToUpdateAssayType();
    return (

        <EditableTableCell onlyAdminCanEdit={true} nullDescription="None" assayType={props} initialText={props.assayType.units ? props.assayType.units : ""} saveText={(newUnits : string) => {
            updateAssayType({
                assayTypeId : props.assayType.id,
                name : null,
                units : newUnits,
                description : null,
            })
        }}/>

    )
}