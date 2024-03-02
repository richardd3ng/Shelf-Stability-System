import { AssayInfo } from "@/lib/controllers/types";
import { hashPassword } from "../auth/authHelpers";
import { db } from "../db";
import { Prisma, User } from "@prisma/client";
import { LocalDate } from "@js-joda/core";

export async function createUserInDB(
    username: any,
    password: string,
    isAdmin: boolean
) {
    return {
        ...(await db.user.create({
            select: {
                id: true,
                username: true,
                is_admin: true,
                is_super_admin: true,
            },
            data: {
                username,
                password: await hashPassword(password),
                is_admin: isAdmin,
                is_super_admin: false,
            },
        })),
    };
}

export async function getAllUsers(): Promise<User[]> {
    const user = await db.user.findFirst({
        where: {
            id: 1,
        },
    });
    const users = await db.user.findMany();
    return users;
}

interface AssayEmailInfo {
    targetDate: LocalDate;
    title: string;
    owner: string;
    condition: string;
    week: number;
    type: string;
}

interface QueryResult {
    userId: number;
    email: string;
}

interface EmailInfo {
    [userId: number]: { email: string; assays: AssayEmailInfo[] };
}

// export async function fetchEmailInfo(): Promise<EmailInfo[]> {
//     const sqlTargetDate = Prisma.sql`CAST(e.start_date + interval '7' day * a.week AS DATE)`;

//     const emailInfo = await db.$queryRaw<EmailInfo[]>(
//         `SELECT email FROM public."User" u, public."Assay" a WHERE u.id = a."ownerId"
//         GROUP BY u.id
//         `
//     );
//     return emailInfo;
// }
