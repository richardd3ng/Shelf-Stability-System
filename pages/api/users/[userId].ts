import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";

export default async function accessUserAPI(
    req: NextApiRequest,
    res: NextApiResponse<Omit<User, 'password'> | ApiError>
) {
    try {
        var userId: number;
        try {
            userId = Number(req.query.userId);

            if (isNaN(userId)) {
                res.status(400).json(
                    getApiError(400, "Invalid user ID")
                );
                return;
            }
        } catch (error) {
            res.status(400).json(
                getApiError(400, "Invalid user ID")
            );
            return;
        }

        if (req.method === "GET") {
            await getUser(userId, res);
        } else if (req.method === "PATCH") {
            await updateUser(userId, req, res);
        } else if (req.method === "DELETE") {
            await deleteUser(userId, res);
        } else {
            res.status(405).json(
                getApiError(405, "Method not allowed")
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Internal server error")
        );
    }
}

async function getUser(userId: number, res: NextApiResponse<Omit<User, 'password'> | ApiError>): Promise<void> {
    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            username: true,
            is_admin: true,
            is_super_admin: true,
        },
    });

    if (user === null) {
        res.status(404).json(
            getApiError(404, `User with ID ${userId} not found`)
        );
    } else {
        res.status(200).json(user);
    }
}

async function updateUser(userId: number, req: NextApiRequest, res: NextApiResponse<Omit<User, 'password'> | ApiError>): Promise<void> {
    const { password, isAdmin } = req.body;

    // TODO prevent updating own admin status or superadmin status

    const updatedUser = {
        ...await db.user.update({
            where: {
                id: userId,
            },
            select: {
                id: true,
                username: true,
                is_admin: true,
                is_super_admin: true,
            },
            data: {
                password: password === "" ? undefined : password,
                is_admin: isAdmin,
            },
        })
    };

    res.status(200).json(updatedUser);
}

async function deleteUser(userId: number, res: NextApiResponse<ApiError | null>): Promise<void> {
    // Get the super admin's id
    // Maybe should be in a library function
    const admin = await db.user.findFirst({
        where: {
            is_super_admin: true
        },
        select: {
            id: true
        }
    });

    // Somehow we don't have a super admin, but we're logged in anyway
    if (admin === null) {
        res.status(500).json(
            getApiError(500)
        );
        console.error("No super admin found, this should never happen");
        return;
    }

    console.log(await db.$transaction([
        db.experiment.updateMany({
            where: {
                ownerId: userId,
            },
            data: {
                ownerId: admin?.id,
            },
        }),
        db.user.delete({
            where: {
                id: userId,
            },
        }),
    ]));

    // TODO can I use the return type to check if the user actually exists

    res.status(200).end();
}
