import { hash } from "bcryptjs";
import { db } from "@/lib/api/db";

export const USER_ID = "ROOT_USER_afuqioweruwnvasf";
export const ADMIN_USERNAME = "admin";

const SALT = 15;

export const hashPassword = async (password: string): Promise<string> => {
    return await hash(password, SALT);
};

export const checkIfAdminExists = async (): Promise<boolean> => {
    try {
        const existingAdmin = await db.user.findFirst({
            where: {
                is_super_admin: true,
            },
        });
        if (existingAdmin) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};
