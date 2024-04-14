import { AssayTypeInfo } from "@/lib/controllers/types";
import React from "react";
import { InitialTextDisplay } from "./initialTextDisplay";



export const UnitsCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    return (
        <InitialTextDisplay text={props.assayType.units} nullDescription="None"/>
    )
}