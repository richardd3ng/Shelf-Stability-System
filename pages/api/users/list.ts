import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { UserTable } from "@/lib/controllers/types";
import { getApiError } from "@/lib/api/error";
import { getToken } from "next-auth/jwt";

export default async function fetchUserList(
    req: NextApiRequest,
    res: NextApiResponse<UserTable | ApiError>
) {
    const token = await getToken({ req });

    if (token === null || !token.name) {
        res.status(403).json(
            getApiError(403, "You are not authorized to view the list of users")
        );
        return;
    }

    var page;
    var pageSize;
    try {
        page = parseInt(req.query.page as string);
        pageSize = parseInt(req.query.page_size as string);
    } catch (error) {
        res.status(400).json(getApiError(400, "Invalid page or page_size"));
        return;
    }

    const query = (req.query.query || "") as string;

    try {
        const userTable: UserTable = {
            rows: await db.user
                .findMany({
                    skip: page * pageSize,
                    take: pageSize,
                    select: {
                        id: true,
                        is_admin: true,
                        username: true,
                    },
                    where: {
                        username: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                })
                .then((users) =>
                    users.map((user) => ({
                        ...user,
                        is_admin: user.is_admin === true,
                    }))
                ), // Account for null is_admin
            rowCount: await db.user.count(),
        };
        res.status(200).json(userTable);
    } catch (error) {
        console.error(error);
        res.status(500).json(getApiError(500, "Failed to fetch users"));
    }
}
