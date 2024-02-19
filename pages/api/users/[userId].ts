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
        } catch (error) {
            res.status(400).json(
                getApiError(400, "Invalid assay ID")
            );
            return;
        }

        if (req.method === "GET") {
            await getUser(userId, res);
        } else if (req.method === "PATCH") {
            await updateUser(userId, req, res);
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
