import React, { useContext } from "react";
import {
    AppBar,
    Button,
    Link,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import { useRouter } from "next/router";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { useState } from "react";

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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
            text: "Lab Utilization",
            onClick: () => router.push("/utilization"),
            path: "/utilization",
        },
        {
            text: "Users",
            onClick: () => router.push("/users"),
            path: "/users",
            hidden: !user?.isAdmin,
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
                <Button
                    color="inherit"
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    endIcon={<AccountCircle />}
                    sx={{ textTransform: "none" }}
                >
                    <Typography variant="subtitle1">
                        {user?.displayName || "Guest"}
                    </Typography>
                </Button>
                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem
                        onClick={() => router.push("/auth/updatePassword")}
                        hidden={user?.isSSO}
                    >
                        <Settings sx={{ marginRight: 1 }} />
                        Update Password
                    </MenuItem>
                    <MenuItem onClick={() => router.push("/auth/signOut")}>
                        <Logout sx={{ marginRight: 1 }} />
                        Sign Out
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
