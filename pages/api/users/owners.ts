import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { UserInfo } from "@/lib/controllers/types";
import { getApiError } from "@/lib/api/error";
import { getToken } from "next-auth/jwt";

export default async function fetchOwnersAPI(
    req: NextApiRequest,
    res: NextApiResponse<UserInfo[] | ApiError>
) {
    const token = await getToken({ req });

    if (token === null || !token.name) {
        res.status(403).json(
            getApiError(
                403,
                "You are not authorized to fetch the list of owners"
            )
        );
        return;
    }

    try {
        const owners: UserInfo[] = await db.user
            .findMany({
                select: {
                    id: true,
                    is_admin: true,
                    username: true,
                },
                where: {
                    experiments: {
                        some: {},
                    },
                },
            })
            .then((users) =>
                users.map((user) => ({
                    ...user,
                    is_admin: user.is_admin === true,
                }))
            );
        res.status(200).json(owners);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to fetch owners on server")
        );
    }
}
