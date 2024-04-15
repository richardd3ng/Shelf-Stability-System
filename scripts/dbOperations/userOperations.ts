import { hashPassword } from "../../lib/api/auth/authHelpers";
import { db } from "../../lib/api/db";
import { User } from "@prisma/client";
import { LocalDate, ZoneId, nativeJs } from "@js-joda/core";
import { EmailInfo, EmailQueryResult } from "@/lib/controllers/types";
import { UserImportJSON } from "../importData/jsonParser";

export async function createUserInDB(user: UserImportJSON) {
    return {
        ...(await db.user.create({
            select: {
                id: true,
                username: true,
                isAdmin: true,
                isSuperAdmin: true,
                displayName: true,
                email: true,
            },
            data: {
                username: user.username,
                password: await hashPassword(user.password),
                isAdmin: user.administrator_permission,
                isSuperAdmin: false,
                displayName: user.display_name,
                isSSO: user.authentication_type !== "local",
                email: user.email_address,
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

export async function createOrUpdateUser(
    username: string,
    displayName: string,
    email: string,
    isSSO: boolean
) {
    return {
        ...(await db.user.upsert({
            where: {
                username,
            },
            update: {
                displayName,
                email,
            },
            create: {
                username,
                displayName,
                email,
                isSSO,
                isAdmin: false,
                isSuperAdmin: false,
            },
        })),
    };
}

export const fetchEmailInfo = async (): Promise<EmailInfo> => {
    const today = LocalDate.now().toString();
    const dateLimit = LocalDate.now().plusWeeks(1).toString();
    const queryResults = await db.$queryRaw<EmailQueryResult[]>`
    WITH owners AS (
        WITH upcoming_assays AS (
            SELECT e."ownerId" AS "userId", e."startDate" + INTERVAL '1 WEEK' * a.week AS "targetDate", e.id AS "experimentId", e.title, e."ownerId", a."conditionId", a.week, a."assayTypeId" AS "assayTypeFromExperimentId", a.sample
            FROM public."Assay" a INNER JOIN public."Experiment" e ON a."experimentId" = e.id
            WHERE NOT e."isCanceled" AND e."startDate" + INTERVAL '1 WEEK' * a.week <= Date(${dateLimit})
            AND e."startDate" + INTERVAL '1 WEEK' * a.week >= Date(${today})
        )
        SELECT u."userId", u."targetDate", u."experimentId", u.title, u."ownerId", u."conditionId", u.week, a."assayTypeId", a."technicianId", u.sample
        FROM upcoming_assays u INNER JOIN public."AssayTypeForExperiment" a ON u."assayTypeFromExperimentId" = a.id
    ),
    technicians AS (
        WITH upcoming_assays AS (
            SELECT e."startDate" + INTERVAL '1 WEEK' * a.week AS "targetDate", e.id AS "experimentId", e.title, e."ownerId", a."conditionId", a.week, a."assayTypeId" AS "assayTypeFromExperimentId", a.sample
            FROM public."Assay" a INNER JOIN public."Experiment" e ON a."experimentId" = e.id
            WHERE NOT e."isCanceled" AND e."startDate" + INTERVAL '1 WEEK' * a.week <= Date(${dateLimit})
            AND e."startDate" + INTERVAL '1 WEEK' * a.week >= Date(${today})
        )
        SELECT a."technicianId" AS "userId", u."targetDate", u."experimentId", u.title, u."ownerId", u."conditionId", u.week, a."assayTypeId", a."technicianId", u.sample
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
        SELECT r."userId", r."targetDate", r."experimentId", r.title, r."ownerId", r."conditionId", r.week, a.name AS "assayType", r."technicianId", r.sample
        FROM recipients r INNER JOIN public."AssayType" a ON r."assayTypeId" = a.id
    ),
    with_conditions AS (
        SELECT w."userId", w."targetDate", w."experimentId", w.title, w."ownerId", c.name AS condition, w.week, w."assayType", w."technicianId", w.sample
        FROM with_type_names w INNER JOIN public."Condition" c ON w."conditionId" = c.id
    ),
    with_technician AS (
        SELECT w."userId", w."targetDate", w."experimentId", w.title, w."ownerId", w.condition, w.week, w."assayType", COALESCE(u.username, 'N/A') AS "technicianUsername", COALESCE(u."displayName", 'N/A') AS "technicianDisplayName", w.sample
        FROM with_conditions w LEFT OUTER JOIN public."User" u ON w."technicianId" = u.id
    ),
    with_owner AS (
        SELECT w."userId", w."targetDate", w."experimentId", w.title, u.username AS "ownerUsername", u."displayName" as "ownerDisplayName", w.condition, w.week, w."assayType", w."technicianUsername", w."technicianDisplayName", w.sample
        FROM with_technician w INNER JOIN public."User" u ON w."ownerId" = u.id
    )
    SELECT w."userId", u.email, w."targetDate", w."experimentId", w.title, w."ownerUsername", w."ownerDisplayName", w.condition, w.week, w."assayType", w."technicianUsername", w."technicianDisplayName", w.sample
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
                owner: `${row.ownerDisplayName} (${row.ownerUsername})`,
                condition: row.condition,
                week: row.week,
                assayType: row.assayType,
                technician:
                    row.technicianUsername !== "N/A"
                        ? `${row.technicianDisplayName} (${row.technicianUsername})`
                        : "N/A",
                sample: row.sample,
            });
        }
    });
    return emailInfo;
};
