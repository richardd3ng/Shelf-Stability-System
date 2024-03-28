import { useContext } from "react";
import { useSession } from "next-auth/react";
import { CurrentUserContext } from "../context/users/currentUserContext";

export const INVALID_USER_ID = -1;
export const INVALID_USERNAME = "INVALID_USER";

export interface UserInfo {
    username: string | null | undefined;
    isLoggedIn: boolean;
    userId: number | undefined;
    isAdmin : boolean;
}
export const useUserInfo = (): UserInfo => {
    const { data, status } = useSession();
    const {user : userInDB} = useContext(CurrentUserContext);
    const isLoggedIn = status === "authenticated";
    const username = data?.user?.name;
    const user: any = data?.user;
    const id = user?.id ?? INVALID_USER_ID;
    return { username, isLoggedIn, userId: Number(id), isAdmin : userInDB? userInDB.isAdmin : false };
    //return { username, isLoggedIn, userId: Number(id), isAdmin : true };
};
