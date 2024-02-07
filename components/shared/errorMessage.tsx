import { Typography } from "@mui/material";

interface ErrorMessageProps {
    message: string;
}
export const ErrorMessage: React.FC<ErrorMessageProps> = (
    props: ErrorMessageProps
) => {
    return <Typography align="center" color="red">{props.message}</Typography>;
};
