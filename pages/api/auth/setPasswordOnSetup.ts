import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { db } from "@/lib/api/db";
import {
    ADMIN_USERNAME,
    USER_ID,
    checkIfAdminExists,
    hashPassword,
} from "@/lib/api/auth/authHelpers";

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
        const currentDate = new Date(Date.now());
        await db.user.create({
            data: {
                password: newPassword,
                username: ADMIN_USERNAME
            },
        });
        res.status(200).json(jsonData);
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg });
    }
}
