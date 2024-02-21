import React from "react";
import { Button, Typography } from "@mui/material";
interface ButtonWithLoadingAndErrorProps {
    text: string;
    isLoading: boolean;
    error: any;
    isError: boolean;
    onSubmit: () => void;
}

export const ButtonWithLoadingAndError: React.FC<
    ButtonWithLoadingAndErrorProps
> = (props: ButtonWithLoadingAndErrorProps) => {
    return (
        <Button variant="contained" color="primary" onClick={props.onSubmit}>
            <Typography>{props.text}</Typography>
        </Button>
    );
};
