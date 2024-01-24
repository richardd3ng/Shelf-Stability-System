import { Typography, Container } from "@mui/material";

interface ErrorMessageProps{
    message : string;
}
export const ErrorMessage : React.FC<ErrorMessageProps> = (props : ErrorMessageProps) => {
    return (
        <Typography>{props.message}</Typography>
    )
}