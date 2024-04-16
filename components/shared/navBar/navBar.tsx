import React, { useContext } from "react";
import {
    AppBar,
    Link,
    Toolbar,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { NavBarButtonProps } from "./navBarButton";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { MobileNavBarOptions } from "./mobileNavBarOptions";
import WideNavBarOptions from "./wideNavBarOptions";

export const NavBar: React.FC = () => {
    const router = useRouter();
    const { user } = useContext(CurrentUserContext);
    const isMobile = useIsMobile();

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

                
                {
                isMobile 
                ?
                <MobileNavBarOptions options={options}/>
                :
                <WideNavBarOptions options={options}/>
                }
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
