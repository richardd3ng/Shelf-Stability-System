import { Typography } from "@mui/material";
import React from "react";



interface InitialTextDisplayProps {
    text: string | null;
    nullDescription: string;
}
export const InitialTextDisplay: React.FC<InitialTextDisplayProps> = (props: InitialTextDisplayProps) => {
    if (props.text) {
        return (
            <Typography style={{ width: "100%", }}>
                {props.text}
            </Typography>
        );
    } else {
        return (
            <Typography style={{ width: "100%",  color: "gray" }}>
                {props.nullDescription}
            </Typography>
        );
    }
};

