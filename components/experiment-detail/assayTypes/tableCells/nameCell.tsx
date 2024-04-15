import { AssayTypeInfo } from "@/lib/controllers/types";
import React from "react";
import { Stack, Tooltip } from "@mui/material";
import { InitialTextDisplay } from "./initialTextDisplay";
import Star from "@mui/icons-material/Star";


export const NameCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    return (
       <Stack direction="row" gap={1}>
            <InitialTextDisplay text={props.assayType.name} nullDescription="None"/>
            {
                props.assayType.isCustom 
                ?
                <Tooltip title="Custom Type">
                    <Star color="info"/>
                </Tooltip>
                : 
                null

            }
       </Stack>
    )
}