import React, { useContext, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Button, MenuItem, Menu} from '@mui/material';
import { Menu as MenuIcon, Close, Settings, AccountCircle, Logout } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { NavBarButtonProps } from './navBarButton';
import { CurrentUserContext } from '@/lib/context/users/currentUserContext';



export interface MobileNavBarProps {
    options : NavBarButtonProps[];
}

export const MobileNavBarOptions: React.FC<MobileNavBarProps> = (props: MobileNavBarProps) => {
    const [openStatus, setOpenStatus] = useState<boolean>(false);
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {user} = useContext(CurrentUserContext);

    let color = "white";
    return (
        <>
        <IconButton edge="start"  onClick={() => setOpenStatus(true)}>
            <MenuIcon style={{color : color}}/>
        </IconButton>
        <Drawer
            anchor="right"
            open={openStatus}
            onClose={() => setOpenStatus(false)}
            style={{width : 500}}
        >
            
            <List>
                <ListItem button onClick={() => setOpenStatus(false)}>
                    <ListItemIcon>
                    <Close style={{color : "red"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Close" style={{color : "red", marginBottom : 8}} />
                </ListItem>

                {props.options.filter((option) => !option.hidden).map((option) => (
                    <ListItem button onClick={option.onClick} key={option.path} >
                
                        <ListItemText primary={option.text} style={{marginLeft : 16, marginRight : 16}}/>
                    </ListItem>
                ))}
            </List>
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
        </Drawer>
        </>
    );
};