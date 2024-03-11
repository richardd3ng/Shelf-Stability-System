import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { Prisma, User } from "@prisma/client";
import { hashPassword } from "@/lib/api/auth/authHelpers";
import { checkIfUserIsAdmin } from "@/lib/api/auth/checkIfAdminOrExperimentOwner";
import { getToken } from "next-auth/jwt";

export default async function createUser(
    req: NextApiRequest,
    res: NextApiResponse<Omit<User, 'password'> | ApiError>
) {
    try {
        const token = await getToken({ req });

        if (token === null || !token.name || !(await checkIfUserIsAdmin(token.name))) {
            res.status(403).json(getApiError(403, "You are not authorized to create a user"));
            return;
        }

        const { username, password, isAdmin } = req.body;
        if (typeof username !== "string" || username === "" || typeof password !== "string" || password === "" || typeof isAdmin !== "boolean") {
            res.status(400).json(getApiError(400, "Invalid username, password, or isAdmin"));
            return;
        }

        const result = {
            ...await db.user.create({
                select: {
                    id: true,
                    username: true,
                    isAdmin: true,
                    isSuperAdmin: true
                },
                data: {
                    username,
                    password: await hashPassword(password),
                    isAdmin: isAdmin,
                    isSuperAdmin: false
                }
            })
        };

        res.status(200).json({ ...result });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Return a more specific error message for duplicate username
            if (
                error.code === "P2002" &&
                (error.meta?.target as string[])?.includes("username")
            ) {
                res.status(400).json(
                    getApiError(
                        400,
                        `A user with the username "${req.body.username}" already exists.`
                    )
                );
                return;
            }
        }
        console.error(error);
        res.status(500).json(
            getApiError(
                500,
                "Failed to create user"
            )
        );
    }
}
