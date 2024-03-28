import { AssayTypeInfo } from "@/lib/controllers/types";
import { useMutationToUpdateAssayType } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import React from "react";
import { Typography } from "@mui/material";
import { EditableTableCell } from "./editableTableCell";


export const DescriptionCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {mutate : updateAssayType} = useMutationToUpdateAssayType();
    return (
        <Typography  >
            <EditableTableCell onlyAdminCanEdit={true} nullDescription="No Description" assayType={props} initialText={props.assayType.description} saveText={(newDescription : string) => {
                updateAssayType({
                    assayTypeId : props.assayType.id,
                    name : null,
                    units : null,
                    description : newDescription
                })
            }}/>
        </Typography>
    )
}