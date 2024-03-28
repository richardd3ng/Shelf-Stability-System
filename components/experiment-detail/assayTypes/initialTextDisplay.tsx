import { ParsePosition } from "@js-joda/core";
import { Tooltip, Typography } from "@mui/material";
import React from "react";



interface InitialTextDisplayProps {
    text: string | null;
    nullDescription: string;
}
export const InitialTextDisplay: React.FC<InitialTextDisplayProps> = (props: InitialTextDisplayProps) => {
    if (props.text) {
        return (
            <Typography style={{ cursor: "pointer", width: "100%", }}>
                {props.text}
            </Typography>
        );
    } else {
        return (
            <Typography style={{ cursor: "pointer", width: "100%",  color: "gray" }}>
                {props.nullDescription}
            </Typography>
        );
    }
};

interface TextDisplayWithHoverProps {
    text : string | null;
    nullDescription : string;
    onClick : () => void;
    canClick : boolean;
    hoverText : string;
}
export const TextDisplayWithHover : React.FC<TextDisplayWithHoverProps> = (props : TextDisplayWithHoverProps) => {
    return (
        <Tooltip title={props.hoverText} onClick={() => {
            console.log("clicked!")
            props.onClick();
        }} >
            <InitialTextDisplay text={props.text} nullDescription={props.nullDescription}/>
        </Tooltip>
    )
}