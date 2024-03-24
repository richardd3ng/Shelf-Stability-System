import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { UserTable } from "@/lib/controllers/types";
import { getApiError } from "@/lib/api/error";
import { getToken } from "next-auth/jwt";

export default async function fetchUserListAPI(
    req: NextApiRequest,
    res: NextApiResponse<UserTable | ApiError>
) {
    const token = await getToken({ req });

    if (token === null || !token.name) {
        res.status(401).json(
            getApiError(401, "You are not authorized to view the list of users")
        );
        return;
    }

    let page;
    let pageSize;
    try {
        page = req.query.page ? parseInt(req.query.page as string) : undefined;
        pageSize = req.query.page_size
            ? parseInt(req.query.page_size as string)
            : undefined;
    } catch (error) {
        res.status(400).json(getApiError(400, "Invalid page or page_size"));
        return;
    }

    const query = (req.query.query || "") as string;

    try {
        const userCount = await db.user.count();
        const userTable: UserTable = {
            rows: await db.user
                .findMany({
                    skip: page && pageSize ? page * pageSize : 0,
                    take: pageSize ?? userCount,
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        isAdmin: true,
                        isSSO: true,
                        username: true,
                    },
                    where: {
                        username: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                }),
            rowCount: userCount,
        };
        res.status(200).json(userTable);
    } catch (error) {
        console.error(error);
        res.status(500).json(getApiError(500, "Failed to fetch users"));
    }
}
