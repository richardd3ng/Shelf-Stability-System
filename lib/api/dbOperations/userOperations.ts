import { hashPassword } from "../auth/authHelpers";
import { db } from "../db";
import { User } from "@prisma/client";


export async function createUserInDB(username: any, password: string, isAdmin: boolean) {
    return {
        ...await db.user.create({
            select: {
                id: true,
                username: true,
                is_admin: true,
                is_super_admin: true
            },
            data: {
                username,
                password: await hashPassword(password),
                is_admin: isAdmin,
                is_super_admin: false
            }
        })
    };
}

export async function createOrUpdateUser(username: string, displayName: string, email: string, isSSO: boolean) {
    return {
        ...await db.user.upsert({
            where: {
                username
            },
            update: {
                displayName,
                email
            },
            create: {
                username,
                displayName,
                email,
                isSSO,
                isAdmin: false,
                isSuperAdmin: false
            }
        })
    };
};

export async function getAllUsers () : Promise<User[]> {
    const user = await db.user.findFirst({
        where : {
            id : 1
        }
    })
    const users =  await db.user.findMany();
    return users;
}