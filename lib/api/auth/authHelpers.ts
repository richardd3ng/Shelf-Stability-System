import { hash } from "bcryptjs";
import { db } from "@/lib/api/db";
import { getErrorMessage } from "../apiHelpers";

export const USER_ID = "ROOT_USER_afuqioweruwnvasf";

const SALT = 15;

export const hashPassword = async (password: string): Promise<string> => {
    return await hash(password, SALT);
};

export const checkIfPasswordHasBeenSet = async (): Promise<boolean> => {
    try {
        const existingPwd = await db.user.findUnique({
            where: {
                username: USER_ID,
            },
        });
        if (existingPwd) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(getErrorMessage(error));
        return false;
    }
};
