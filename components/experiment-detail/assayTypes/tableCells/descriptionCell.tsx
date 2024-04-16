import { AssayTypeInfo } from "@/lib/controllers/types";
import React from "react";
import { InitialTextDisplay } from "./initialTextDisplay";


export const DescriptionCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    return (
        <InitialTextDisplay text={props.assayType.description} nullDescription="None"/>
    )
}