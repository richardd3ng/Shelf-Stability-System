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
import { NavBarButtonProps, NavBarButton } from "./navBarButton";


export interface WideNavBarOptionsProps {
    options : NavBarButtonProps[];
}

export const WideNavBarOptions: React.FC<WideNavBarOptionsProps> = (props : WideNavBarOptionsProps) => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {user} = useContext(CurrentUserContext);

    return (
        <>
                
                {props.options
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
                        sx={{ display: user?.isSSO ? "none" : undefined}}
                    >
                        <Settings sx={{ marginRight: 1 }} />
                        Update Password
                    </MenuItem>
                    <MenuItem onClick={() => router.push("/auth/signOut")}>
                        <Logout sx={{ marginRight: 1 }} />
                        Sign Out
                    </MenuItem>
                </Menu>
        </>
    );
};

export default WideNavBarOptions;
