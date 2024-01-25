import NavBar from "./nav-bar";
import React, { ReactNode } from "react";
import { Stack } from "@mui/material";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Stack spacing={2}>
            <NavBar />
            <main>{children}</main>
        </Stack>
    );
};

export default Layout;
