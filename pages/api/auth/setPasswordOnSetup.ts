import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/api/db";
import {
    ADMIN_DISPLAY_NAME,
    ADMIN_USERNAME,
    checkIfAdminExists,
    hashPassword,
} from "@/lib/api/auth/authHelpers";
import { getApiError } from "@/lib/api/error";

export default async function setPasswordOnSetupAPI(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const adminExists = await checkIfAdminExists();
        if (adminExists) {
            throw new Error("Admin password has already been set");
        }

        const jsonData = req.body;
        const newPassword = await hashPassword(jsonData.newPassword);
        await db.user.create({
            data: {
                password: newPassword,
                username: ADMIN_USERNAME,
                displayName: ADMIN_DISPLAY_NAME,
                isSSO: false,
                isAdmin: true,
                isSuperAdmin: true,
            },
        });
        res.status(200).json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to set admin password on server")
        );
    }
}
