import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

const NavBar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex" }}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                        flex: 1,
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    Shelf Stability Tracking System
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        justifyContent: "center",
                    }}
                >
                    <Link
                        href="#"
                        color="inherit"
                        sx={{
                            marginRight: "33%",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Experiments
                    </Link>
                    <Link
                        href="#"
                        color="inherit"
                        sx={{
                            marginRight: "50%",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Agenda
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Link
                        href="#"
                        color="inherit"
                        sx={{
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Sign Out
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
