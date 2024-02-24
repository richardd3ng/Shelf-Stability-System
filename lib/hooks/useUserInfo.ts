import { Construction } from "@mui/icons-material";
import { useSession } from "next-auth/react"

export const BAD_ID = -1;
export interface UserInfo{
    username : string | null | undefined;
    isLoggedIn : boolean;
    userId : number | undefined;
}
export const useUserInfo = () : UserInfo => {
    const {data, status} = useSession();
    const isLoggedIn = status === "authenticated";
    const username = data?.user?.name;
    const user : any = data?.user;
    const id = user?.id 
    console.log(data);
    return {username, isLoggedIn, userId: id}
}