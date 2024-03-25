import { fetchUser } from "@/lib/controllers/userController";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import React, {
    createContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { useAlert } from "../shared/alertContext";

export const CurrentUserContext = createContext<{
    user: Omit<User, 'password'> | undefined;
}>({
    user: undefined,
});

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<Omit<User, 'password'> | undefined>(undefined);
    const userInfo = useUserInfo();
    const alert = useAlert();

    async function updateUser(userId: number) {
        const user = await fetchUser(userId);

        if (user instanceof ApiError) {
            alert.showAlert("error", user.message);
            return;
        }

        setUser(user);
    }

    useEffect(() => {
        const userId = userInfo.userId;
        setUser(undefined);
        
        if (userId === undefined || isNaN(userId) || userId < 0) {
            return;
        }

        updateUser(userId);
    }, [userInfo.userId]);

    return (
        <CurrentUserContext.Provider value={{ user }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
