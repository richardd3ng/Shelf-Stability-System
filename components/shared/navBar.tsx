import React, { useContext } from "react";
import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";

interface NavBarButtonProps {
    text: string;
    onClick: () => void;
    path: string;
    hidden?: boolean;
}
const NavBarButton: React.FC<NavBarButtonProps> = (
    props: NavBarButtonProps
) => {
    const router = useRouter();
    const isActive = router.pathname === props.path;

    return (
        <Button
            color="inherit"
            style={{ textTransform: "none" }}
            onClick={props.onClick}
            sx={{
                backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.2)"
                    : "inherit",
            }}
        >
            <Typography>{props.text}</Typography>
        </Button>
    );
};

const NavBar: React.FC = () => {
    const router = useRouter();
    const { user } = useContext(CurrentUserContext);

    const options: NavBarButtonProps[] = [
        {
            text: "Experiments",
            onClick: () => router.push("/experiment-list"),
            path: "/experiment-list",
        },
        {
            text: "Assay Agenda",
            onClick: () => router.push("/agenda"),
            path: "/agenda",
        },
        {
            text: "Users",
            onClick: () => router.push("/users"),
            path: "/users",
            hidden: !user?.isAdmin,
        },
        {
            text: "Change Password",
            onClick: () => router.push("/auth/updatePassword"),
            path: "/auth/updatePassword",
            hidden: user?.isSSO,
        },
        {
            text: "Sign Out",
            onClick: () => router.push("/auth/signOut"),
            path: "/auth/signOut",
        },
    ];

    return (
        <AppBar position="sticky" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    <Link
                        href="/experiment-list"
                        style={{ color: "inherit", textDecoration: "none" }}
                    >
                        Shelf Stability System
                    </Link>
                </Typography>

                {options
                    .filter((option) => !option.hidden)
                    .map((option, index) => (
                        <NavBarButton
                            key={index}
                            text={option.text}
                            onClick={option.onClick}
                            path={option.path}
                        />
                    ))}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
