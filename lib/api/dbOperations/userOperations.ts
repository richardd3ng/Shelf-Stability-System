import { hashPassword } from "../auth/authHelpers";
import { db } from "../db";
import { User } from "@prisma/client";


export async function createUserInDB(username: any, password: string, isAdmin: boolean) {
    return {
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
}

export async function getAllUsers () : Promise<User[]> {
    const user = await db.user.findFirst({
        where : {
            id : 1
        }
    })
    const users =  await db.user.findMany();
    return users;
}