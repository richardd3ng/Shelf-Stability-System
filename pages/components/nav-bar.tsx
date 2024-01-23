import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          Shelf Stability Tracking System
        </Typography>
        {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}

        <Box sx={{ flexGrow: 1 }}>
          <Link href="#" color="inherit" sx={{ padding: 15 }}>
            {"Experiments"}
          </Link>
          <Link href="#" color="inherit">
            {"Agenda"}
          </Link>
        </Box>
        <Link href="#" color="inherit">
          {"Sign Out"}
        </Link>
      </Toolbar>
    </AppBar>
  );
}
