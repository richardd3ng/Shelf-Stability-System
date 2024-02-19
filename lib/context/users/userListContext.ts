import { createContext } from "react";

interface UserListContextType {
    query: string;
    setQuery: (query: string) => void;
    reload: () => void;
}

export const UserListContext = createContext<UserListContextType>({
    query: "",
    setQuery: () => { },
    reload: () => { },
})
