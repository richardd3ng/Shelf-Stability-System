import { CircularProgress, Container, Typography } from "@mui/material";
import React from "react";

export const LoadingCircle: React.FC = () => {
    return <CircularProgress style={{ margin: "0 auto" }} />;
};

interface LoadingContainerProps {
    text?: string;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = (
    props: LoadingContainerProps
) => {
    return (
        <Container
            maxWidth="sm"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {props.text ? (
                <CircularProgress
                    sx={{
                        margin: "0 auto",
                        marginLeft: "55%",
                    }}
                />
            ) : (
                <LoadingCircle />
            )}
            {props.text && (
                <Typography variant="body1">{props.text}</Typography>
            )}
        </Container>
    );
};
