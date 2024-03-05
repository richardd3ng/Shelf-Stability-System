import { hashPassword } from "../auth/authHelpers";
import { db } from "../db";
import { User } from "@prisma/client";
import { LocalDate, ZoneId, nativeJs } from "@js-joda/core";
import { EmailInfo, EmailQueryResult } from "@/lib/controllers/types";

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

export const fetchEmailInfo = async (): Promise<EmailInfo> => {
    const dateLimit = LocalDate.now().plusWeeks(1).toString();
    const queryResults = await db.$queryRaw<EmailQueryResult[]>`
    WITH owners AS (
        WITH upcoming_assays AS (
            SELECT e."ownerId" AS "userId", e."startDate" + INTERVAL '1 WEEK' * a.week AS "targetDate", e.title, e."ownerId", a."conditionId", a.week, a."assayTypeId" AS "assayTypeFromExperimentId"
            FROM public."Assay" a INNER JOIN public."Experiment" e ON a."experimentId" = e.id
            WHERE NOT e."isCanceled" AND e."startDate" + INTERVAL '1 WEEK' * a.week <= Date(${dateLimit})
        )
        SELECT u."userId", u."targetDate", u.title, u."ownerId", u."conditionId", u.week, a."assayTypeId", a."technicianId"
        FROM upcoming_assays u INNER JOIN public."AssayTypeForExperiment" a ON u."assayTypeFromExperimentId" = a.id
    ),
    technicians AS (
        WITH upcoming_assays AS (
            SELECT e."startDate" + INTERVAL '1 WEEK' * a.week AS "targetDate", e.title, e."ownerId", a."conditionId", a.week, a."assayTypeId" AS "assayTypeFromExperimentId"
            FROM public."Assay" a INNER JOIN public."Experiment" e ON a."experimentId" = e.id
            WHERE NOT e."isCanceled" AND e."startDate" + INTERVAL '1 WEEK' * a.week <= Date(${dateLimit})
        )
        SELECT a."technicianId" AS "userId", u."targetDate", u.title, u."ownerId", u."conditionId", u.week, a."assayTypeId", a."technicianId"
        FROM upcoming_assays u INNER JOIN public."AssayTypeForExperiment" a ON u."assayTypeFromExperimentId" = a.id
        WHERE a."technicianId" IS NOT NULL
    ),
    recipients AS (
        SELECT *
        FROM owners
        UNION
        SELECT *
        FROM technicians
    ),
    with_type_names AS (
        SELECT r."userId", r."targetDate", r.title, r."ownerId", r."conditionId", r.week, a.name AS "assayType", r."technicianId"
        FROM recipients r INNER JOIN public."AssayType" a ON r."assayTypeId" = a.id
    ),
    with_conditions AS (
        SELECT w."userId", w."targetDate", w.title, w."ownerId", c.name AS condition, w.week, w."assayType", w."technicianId"
        FROM with_type_names w INNER JOIN public."Condition" c ON w."conditionId" = c.id
    ),
    with_technician AS (
        SELECT w."userId", w."targetDate", w.title, w."ownerId", w.condition, w.week, w."assayType", COALESCE(u.username, 'N/A') AS technician
        FROM with_conditions w LEFT OUTER JOIN public."User" u ON w."technicianId" = u.id
    ),
    with_owner AS (
        SELECT w."userId", w."targetDate", w.title, u.username AS owner, w.condition, w.week, w."assayType", w.technician
        FROM with_technician w INNER JOIN public."User" u ON w."ownerId" = u.id
    )
    SELECT w."userId", u.email, w."targetDate", w.title, w.owner, w.condition, w.week, w."assayType", w.technician
    FROM with_owner w INNER JOIN public."User" u ON w."userId" = u.id
    ORDER BY "targetDate"`;

    const emailInfo: EmailInfo = {};
    queryResults.forEach((row: EmailQueryResult) => {
        if (row.email) {
            if (!emailInfo[row.userId]) {
                emailInfo[row.userId] = { email: row.email, agenda: [] };
            }
            emailInfo[row.userId].agenda.push({
                targetDate: LocalDate.from(
                    nativeJs(row.targetDate, ZoneId.UTC)
                ),
                experimentId: row.experimentId,
                title: row.title,
                owner: row.owner,
                condition: row.condition,
                week: row.week,
                assayType: row.assayType,
                technician: row.technician,
            });
        }
    });
    return emailInfo;
};
