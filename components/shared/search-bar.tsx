import { useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { Box, Button } from "@mui/material";

interface SearchBarProps {
    placeholder: string;
    value?: string;
    onSearch: (searchText: string) => void;
}

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    width: "100%",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
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
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
    },
}));

const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {
    const [query, setQuery] = useState<string>(props.value || "");

    useEffect(() => {
        setQuery(props.value || "");
    }, [props.value]);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            props.onSearch(query);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.currentTarget.value);
    };

    return (
        <Box
            display="flex"
            sx={{
                border: "1px solid rgba(0, 0, 0, 0.5)",
                borderRadius: 2,
            }}
        >
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={props.placeholder}
                    value={query}
                    inputProps={{ "aria-label": "search" }}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                />
            </Search>
            <Button
                sx={{
                    width: 20,
                    textTransform: "none",
                }}
                onClick={() => props.onSearch(query)}
            >
                Search
            </Button>
        </Box>
    );
};

export default SearchBar;
