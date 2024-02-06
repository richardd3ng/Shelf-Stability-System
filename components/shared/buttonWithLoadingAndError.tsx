import React from "react";
import { Button, Typography } from "@mui/material";
import { LoadingCircle } from "./loading";
import { ErrorMessage } from "./errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";
interface ButtonWithLoadingAndErrorProps{
    text : string;
    isLoading : boolean;
    error : any;
    isError : boolean;
    onClick : () => void;
}

export const ButtonWithLoadingAndError : React.FC<ButtonWithLoadingAndErrorProps> = (props : ButtonWithLoadingAndErrorProps) => {
    return (
        <>
            <Button onClick={props.onClick}>
                <Typography>{props.text}</Typography>
                {props.isLoading ? <LoadingCircle/> : null}
                {props.isError ? <ErrorMessage message={getErrorMessage(props.error)}/> : null}
            </Button>
        </>
    )
}
