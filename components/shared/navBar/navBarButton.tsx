import React from "react";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

export interface NavBarButtonProps {
    text: string;
    onClick: () => void;
    path: string;
    hidden?: boolean;
}


export const NavBarButton: React.FC<NavBarButtonProps> = (
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
