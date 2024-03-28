import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/api/db";
import { checkIfAdminExists, hashPassword } from "@/lib/api/auth/authHelpers";
import { compare } from "bcryptjs";
import { getApiError } from "@/lib/api/error";
import { getToken } from "next-auth/jwt";

export default async function updatePasswordAPI(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const token = await getToken({ req: req });
        if (!token || !token.name) {
            throw new Error("You must log in first");
        }
        const username = token.name;
        const jsonData = req.body;

        const passwordHasBeenSet = await checkIfAdminExists();
        if (!passwordHasBeenSet) {
            throw new Error("Must go through the global setup process first");
        }
        const newPassword = await hashPassword(jsonData.newPassword);
        const oldPassword = jsonData.oldPassword;

        const userInDB = await db.user.findFirst({
            where: {
                username: username,
            },
        });

        if (userInDB) {
            // TODO: check this logic with optional passwords
            const oldPasswordIsCorrect = userInDB.password
                ? await compare(oldPassword, userInDB.password)
                : false;
            if (!oldPasswordIsCorrect) {
                res.status(400).json(
                    getApiError(400, "Wrong previous password!")
                );
                return;
            } else {
                const result = await db.user.update({
                    where: {
                        username: username,
                    },
                    data: {
                        password: newPassword,
                    },
                });
                if (!result) {
                    throw new Error("Wrong previous password!");
                }
                res.status(200).json(jsonData);
            }
        } else {
            throw new Error("An error occurred - you are not in the db?");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to update password on server")
        );
    }
}
