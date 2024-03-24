import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { UserInfo } from "@/lib/controllers/types";
import { UNAUTHORIZED_STATUS_CODE, getApiError } from "@/lib/api/error";
import { getToken } from "next-auth/jwt";

export default async function fetchOwnersAndTechniciansAPI(
    req: NextApiRequest,
    res: NextApiResponse<UserInfo[] | ApiError>
) {
    const token = await getToken({ req });

    if (token === null || !token.name) {
        res.status(UNAUTHORIZED_STATUS_CODE).json(
            getApiError(
                UNAUTHORIZED_STATUS_CODE,
                "You are not authorized to fetch the list of owners and technicians"
            )
        );
        return;
    }
    try {
        const ownersAndTechnicians: UserInfo[] = await db.user
            .findMany({
                select: {
                    id: true,
                    isAdmin: true,
                    username: true,
                    displayName: true,
                    email: true,
                    isSSO: true
                },
                where: {
                    OR: [
                        {
                            ownedExperiments: {
                                some: {},
                            },
                        },
                        {
                            assayTypesAsTechnician: {
                                some: {},
                            },
                        },
                    ],
                },
            })
            .then((users) =>
                users.map((user) => ({
                    ...user,
                    isAdmin: user.isAdmin === true,
                }))
            );
        res.status(200).json(ownersAndTechnicians);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to fetch owners and technicians on server")
        );
    }
}
