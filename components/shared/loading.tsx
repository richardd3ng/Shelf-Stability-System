import { CircularProgress, Container } from "@mui/material";
import React from "react";


export const LoadingCircle : React.FC = () => {
    return <CircularProgress style={{margin : '0 auto'}} />

}


export const LoadingContainer : React.FC = () => {
    return (
        <Container maxWidth="sm" style={{display : "flex", alignItems: "center", justifyContent: "center"}}>
            <LoadingCircle/>
        </Container>
    )
}