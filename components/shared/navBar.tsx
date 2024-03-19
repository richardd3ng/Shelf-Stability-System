import React, { useContext } from "react";
import { Button, AppBar, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";

interface NavBarButtonProps {
    text: string;
    onClick: () => void;
    hidden?: boolean;
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
    const { user } = useContext(CurrentUserContext);

    const options: NavBarButtonProps[] = [
        { text: "Experiments", onClick: () => router.push("/experiment-list") },
        { text: "Assay Agenda", onClick: () => router.push("/agenda") },
        { text: "Users", onClick: () => router.push("/users"), hidden: !user?.isAdmin },
        { text : "Change Password", onClick: () => router.push("/auth/updatePassword")},
        { text : "Sign Out", onClick: () => router.push("/auth/signOut")}
    ]
    
    return (
        <AppBar position="sticky" color="primary">
            <Toolbar >
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Shelf Stability System
                </Typography>

                {options.filter(option => !option.hidden).map((option, index) => <NavBarButton key={index} text={option.text} onClick={option.onClick} />)}

            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
