import { AssayTypeInfo } from "@/lib/controllers/types";
import { useMutationToUpdateAssayType } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import React from "react";
import { Typography } from "@mui/material";
import { EditableTableCell } from "./editableTableCell";


export const NameCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {mutate : updateAssayType} = useMutationToUpdateAssayType();
    return (
        <Typography color={props.assayType.isCustom ? "green" : "black" } >
            <EditableTableCell initialText={props.assayType.name} saveText={(newName : string) => {
                updateAssayType({
                    assayTypeId : props.assayType.id,
                    newName : newName,
                    newUnits : null
                })
            }}/>
        </Typography>
    )
}