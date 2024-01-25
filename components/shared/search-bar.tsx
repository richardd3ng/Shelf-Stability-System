import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, KeyboardEvent, useState } from "react";

interface SearchBarProps {
    placeholder: string;
    onEnter: (searchText: string) => void;
}

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 2, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
    },
}));

const SearchBar = (props: SearchBarProps) => {
    const [query, setQuery] = useState<string>("");

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            props.onEnter(query);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.currentTarget.value);
    };

    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder={props.placeholder}
                inputProps={{ "aria-label": "search" }}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
            />
        </Search>
    );
};

export default SearchBar;
