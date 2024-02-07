import React from "react";
import { Button, AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";

interface NavBarButtonProps {
    text: string;
    onClick: () => void;
}
const NavBarButton: React.FC<NavBarButtonProps> = (props: NavBarButtonProps) => {
    return (
        <Button color="inherit" style={{ textTransform: "none" }} onClick={props.onClick}>
            <Typography>{props.text}</Typography>
        </Button>
    );
}
const NavBar: React.FC = () => {
    const router = useRouter();
    const options: NavBarButtonProps[] = [
        { text: "Experiments", onClick: () => router.push("/experiment-list") },
        { text: "Assay Agenda", onClick: () => router.push("/agenda") },
        { text : "Change Password", onClick: () => router.push("/auth/updatePassword")}

    ]
    return (
        <AppBar position="sticky" color="primary">
            <Toolbar >
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Shelf Stability Tracking System
                </Typography>

                {options.map((option, index) => <NavBarButton key={index} text={option.text} onClick={option.onClick} />)}

            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
