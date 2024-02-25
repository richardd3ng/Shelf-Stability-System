import { Box, Button } from "@mui/material";
import SearchBar from "../shared/searchBar";
import { useContext } from "react";
import { UserListContext } from "@/lib/context/users/userListContext";
import { useRouter } from "next/router";

export default function UserListOptions() {
    const { setQuery } = useContext(UserListContext);
    const router = useRouter();

    function createUser() {
        router.push("/users/create");
    }

    return (
        <Box display="flex" sx={{ px: 2 }}>
            <SearchBar placeholder={"Search"} onSearch={setQuery} />
            <Box
                display="flex"
                justifyContent="flex-end"
                flexGrow="1"
            >
                <Button
                    onClick={createUser}
                    variant="contained"
                    color="primary"
                >
                    Add User
                </Button>
            </Box>
        </Box>
    );
}