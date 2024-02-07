import React, { ReactNode } from "react";
import { Button, Typography } from "@mui/material";
import { LoadingCircle } from "./loading";
import { ErrorMessage } from "./errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";
interface ButtonWithLoadingAndErrorProps{
    text : string;
    isLoading : boolean;
    error : any;
    isError : boolean;
    onSubmit : () => void;
}

export const ButtonWithLoadingAndError : React.FC<ButtonWithLoadingAndErrorProps> = (props : ButtonWithLoadingAndErrorProps) => {
    return (
        <YourButtonWithLoadingAndError isLoading={props.isLoading} isError={props.isError} error={props.error}>
            <Button variant="contained" color="primary" onClick={props.onSubmit}>
                <Typography>{props.text}</Typography>
            </Button>
        </YourButtonWithLoadingAndError>
    )
}

interface YourButtonWithLoadingAndErrorProps{
    children : ReactNode;
    isLoading : boolean;
    isError : boolean;
    error : any;
}
export const YourButtonWithLoadingAndError : React.FC<YourButtonWithLoadingAndErrorProps> = (props : YourButtonWithLoadingAndErrorProps) => {
    return (
        <>
            {props.children}
            <LoadingAndError isLoading={props.isLoading} isError={props.isError} error={props.error} />
        </>
    )
}

interface LoadingAndErrorProps{
    isLoading : boolean;
    isError : boolean;
    error : any;
}

export const LoadingAndError : React.FC<LoadingAndErrorProps> = (props : LoadingAndErrorProps) => {
    return (
        <>
            {props.isLoading ? <LoadingCircle/> : null}
            {props.isError ? <ErrorMessage message={getErrorMessage(props.error)}/> : null}
        </>
    )
}