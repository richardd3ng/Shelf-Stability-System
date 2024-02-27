import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { AssayInfo, AssayTable } from "@/lib/controllers/types";
import { Prisma } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { LocalDate } from "@js-joda/core";
import { getToken } from "next-auth/jwt";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";
import { localDateToJsDate } from "@/lib/datesUtils";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";

// Be very careful with this function, it's very easy to introduce SQL injection vulnerabilities
function convertSort(
    field: string | string[] | undefined,
    order: string | string[] | undefined
) {
    if (
        field === undefined ||
        order === undefined ||
        Array.isArray(field) ||
        Array.isArray(order)
    ) {
        return undefined;
    }
    const newOrder: "asc" | "desc" =
        order.toLowerCase() === "asc" ? "asc" : "desc";

    switch (field) {
        case "title":
            return {
                field: "e.title",
                order: newOrder,
            };
        case "targetDate":
            return {
                field: "\"targetDate\"",
                order: newOrder,
            };
        case "id":
        case "result":
            return {
                field: "a." + field,
                order: newOrder,
            };
        // FIXME can't properly sort by type because it's a number in the db, not a string
        case "type":
        case "condition":
        case "week":
        case "owner":
            return {
                field: field,
                order: newOrder,
            };
    }

    return undefined;
}

export default async function getAssays(
    req: NextApiRequest,
    res: NextApiResponse<AssayTable | ApiError>
) {
    // Convert to LocalDate and back for validation
    const minDate = req.query.minDate
        ? localDateToJsDate(LocalDate.parse(req.query.minDate as string))
        : undefined;
    const maxDate = req.query.maxDate
        ? localDateToJsDate(LocalDate.parse(req.query.maxDate as string))
        : undefined;
    const includeRecorded = req.query.include_recorded === "true";
    const token = await getToken({ req });
    const ownedAssaysOnly = req.query.owned_assays_only === "true" && token?.name !== undefined;

    const orderBy = convertSort(req.query.sort_by, req.query.sort_order);
    var page;
    var pageSize;
    try {
        page = parseInt(req.query.page as string);
        pageSize = parseInt(req.query.page_size as string);
    } catch (error) {
        res.status(400).json(getApiError(400, "Invalid page or page_size"));
        return;
    }

    const sqlTargetDate = Prisma.sql`CAST(e.start_date + interval '7' day * a.week AS DATE)`;

    const queryRows = db.$queryRaw<
        (AssayInfo & { targetDate: Date, type: number })[]
    >`SELECT a.id, "targetDate", e.title, a."experimentId" as "experimentId", owner, c.name as condition, a.type, a.week, result."resultId"
    
FROM public."Assay" a,
LATERAL (SELECT title, start_date, ${sqlTargetDate} as "targetDate", u.username as owner FROM public."Experiment" e,
    LATERAL (SELECT username FROM public."User" WHERE e."ownerId" = id) u
    WHERE a."experimentId" = id) e,
LATERAL (SELECT name FROM public."Condition" WHERE a."conditionId" = id) c,
LATERAL (SELECT MIN(id) as "resultId" FROM public."AssayResult" WHERE "assayId" = a.id) result

    WHERE TRUE
    ${maxDate !== undefined
            ? Prisma.sql`AND "targetDate" <= ${maxDate}`
            : Prisma.empty
        }
    ${minDate !== undefined
            ? Prisma.sql`AND "targetDate" >= ${minDate}`
            : Prisma.empty
        }
    ${includeRecorded
            ? Prisma.empty
            : Prisma.sql`AND result."resultId" ISNULL`
        }
    ${ownedAssaysOnly
            ? Prisma.sql`AND owner = ${token.name}`
            : Prisma.empty
        }
    ${orderBy !== undefined
            ? Prisma.raw(`ORDER BY ${orderBy.field} ${orderBy.order}`)
            : Prisma.empty
        }
    LIMIT ${pageSize} OFFSET ${page * pageSize}`
        .then<AssayInfo[]>((assays) =>
            assays.map((assay) => dateFieldsToLocalDate(assay, ["targetDate"]))
                .map((assay) => ({ ...assay, type: assayTypeIdToName(assay.type) })));

    const queryRowCount = db.$queryRaw<{ count: number }[]>`SELECT CAST(COUNT(*) AS INT) as count
        
    FROM public."Assay" a,
    LATERAL (SELECT start_date, ${sqlTargetDate} as "targetDate", u.username as owner FROM public."Experiment" e,
        LATERAL (SELECT username FROM public."User" WHERE e."ownerId" = id) u
        WHERE a."experimentId" = id) e,
    LATERAL (SELECT MIN(id) as "resultId" FROM public."AssayResult" WHERE "assayId" = a.id) result
        WHERE TRUE
        ${maxDate !== undefined
            ? Prisma.sql`AND "targetDate" <= ${maxDate}`
            : Prisma.empty
        }
        ${minDate !== undefined
            ? Prisma.sql`AND "targetDate" >= ${minDate}`
            : Prisma.empty
        }
        ${includeRecorded
            ? Prisma.empty
            : Prisma.sql`AND result."resultId" ISNULL`
        }
        ${ownedAssaysOnly
            ? Prisma.sql`AND owner = ${token.name}`
            : Prisma.empty
        }`.then((res) => res[0].count);

    const [assays, totalRows] = await Promise.all([
        // TODO look at views instead?
        queryRows,
        queryRowCount
    ]);

    res.status(200).json({
        rows: assays,
        rowCount: Number(totalRows),
    });
}

// db.assay.findMany({
//     // Note: skipping requires going through all the records, so it's not efficient for large tables
//     // https://www.prisma.io/docs/orm/prisma-client/queries/pagination
//     skip: (page - 1) * pageSize,
//     take: pageSize,
//     select: {
//         id: true,
//         target_date: true,
//         condition: true,
//         type: true,
//         experiment: true,
//         result: true
//     },
//     where: {
//         target_date: { gte: minDate, lte: maxDate },
//         result: includeRecorded ? undefined : null
//     },
//     orderBy
// }).then(assays =>
//     assays.map(assay => ({
//         id: assay.id,
//         targetDate: assay.target_date,
//         title: assay.experiment.title,
//         condition: assay.condition.name,
//         type: assay.type.name,
//         week: getNumWeeksAfterStartDate(assay.experiment.start_date, assay.target_date),
//         result: assay.result
//     }))
// ),
