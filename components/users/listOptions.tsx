import { Box } from "@mui/material";
import SearchBar from "../shared/search-bar";
import { useContext } from "react";
import { UserListContext } from "@/lib/context/users/userListContext";

export default function UserListOptions() {
    const { setQuery } = useContext(UserListContext);

    return (
        <Box display="flex" flexDirection="row" sx={{ px: 2 }}>
            <SearchBar placeholder={"Search"} onSearch={setQuery} />
        </Box>
    );
}