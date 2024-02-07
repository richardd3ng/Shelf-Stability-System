import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { LoadingCircle } from "./loading";
import { ErrorMessage } from "./errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";

interface ButtonWithConfirmationLoadingAndErrorProps{
    text : string;
    isLoading : boolean;
    isError : boolean;
    error : any;
    onSubmit : () => void;
}

export const ButtonWithConfirmationLoadingAndError : React.FC<ButtonWithConfirmationLoadingAndErrorProps> = (props : ButtonWithConfirmationLoadingAndErrorProps) => {
    const [isAskingToConfirm, setIsAskingToConfirm] = useState<boolean>(false);
    if (!isAskingToConfirm){
        return (
            <Button onClick={() => setIsAskingToConfirm(true)}>
                <Typography>{props.text}</Typography>
            </Button>
        )
    } else {
        return (
            <Stack direction="column">
                <Stack direction="row">
                    <Typography>
                        Are you sure?
                    </Typography>
                    <Button onClick={props.onSubmit}>
                        <Typography>
                            Yes
                        </Typography>
                    </Button>
                    <Button onClick={() => setIsAskingToConfirm(false)}>
                        <Typography>
                            No
                        </Typography>
                    </Button>
                </Stack>
                {props.isLoading ? <LoadingCircle/> : null}
                {props.isError ? <ErrorMessage message={getErrorMessage(props.error)}/> : null}
            </Stack>
        )
    }
}
