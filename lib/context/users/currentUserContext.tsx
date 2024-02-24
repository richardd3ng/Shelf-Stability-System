import { fetchUser } from "@/lib/controllers/userController";
import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import { ApiError } from "next/dist/server/api-utils";
import React, {
    createContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

export const CurrentUserContext = createContext<{
    refreshUser: () => void;
    user: Omit<User, 'password'> | undefined;
}>({
    refreshUser: () => { },
    user: undefined,
});

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [userId, setUserId] = useState<number>(-1);
    const [user, setUser] = useState<Omit<User, 'password'> | undefined>(undefined);

    function refreshId() {
        getSession().then((session) => {
            const userId = session?.user?.id;
            if (userId === null || userId === undefined) {
                return;
            }

            setUserId(userId);
        });
    }

    async function updateUser() {
        const startUserId = userId;
        let user;
        // Keep retrying until it works
        do {
            user = await fetchUser(userId);

            // If the user id has changed, end this
            if (userId !== startUserId) {
                return;
            }
        } while (user instanceof ApiError);

        setUser(user);
    }

    useEffect(() => {
        setUser(undefined);
        if (userId < 0) {
            return;
        }

        updateUser();
    }, [userId]);

    useEffect(() => {
        refreshId();
    }, []);

    return (
        <CurrentUserContext.Provider value={{ refreshUser: refreshId, user }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
