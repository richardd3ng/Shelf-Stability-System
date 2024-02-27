import { useSession } from "next-auth/react";

export const INVALID_USER_ID = -1;
export const INVALID_USERNAME = "INVALID_USER";

export interface UserInfo {
    username: string | null | undefined;
    isLoggedIn: boolean;
    userId: number | undefined;
}
export const useUserInfo = (): UserInfo => {
    const { data, status } = useSession();
    const isLoggedIn = status === "authenticated";
    const username = data?.user?.name;
    const user: any = data?.user;
    const id = user?.id ?? INVALID_USER_ID;
    return { username, isLoggedIn, userId: Number(id) };
};
