import {db} from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { AssayInfo, AssayTable } from "@/lib/controllers/types";
import { Prisma } from "@prisma/client";

// Be very careful with this function, it's very easy to introduce SQL injection vulnerabilities
function convertSort(field: string | string[] | undefined, order: string | string[] | undefined) {
    if (field === undefined || order === undefined || Array.isArray(field) || Array.isArray(order)) {
        return undefined;
    }
    const newOrder: "asc" | "desc" = order.toLowerCase() === "asc" ? "asc" : "desc";

    switch (field) {
        case "title":
            return {
                field: "e.title",
                order: newOrder
            };
        case "id":
        case "result":
            return {
                field: "a." + field,
                order: newOrder
            };
        case "type":
        case "condition":
        case "targetDate":
        case "week":
            return {
                field: field,
                order: newOrder
            };
    }

    return undefined;
}

export default async function getAssays(req: NextApiRequest, res: NextApiResponse<AssayTable>) {
    const minDate = req.query.minDate ? new Date(req.query.minDate as string) : undefined;
    const maxDate = req.query.maxDate ? new Date(req.query.maxDate as string) : undefined;
    const includeRecorded = req.query.include_recorded === "true";
    const orderBy = convertSort(req.query.sort_by, req.query.sort_order);
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.page_size as string);

    const [assays, totalRows] = await Promise.all([
        // TODO look at views instead?
        db.$queryRaw<AssayInfo[]>`SELECT a.id, a.target_date AS targetDate, e.title, c.name as condition, t.name as type, ROUND(EXTRACT(DAY FROM a.target_date - e.start_date) / 7) as week, a.result
            
            FROM public."Assay" a,
            LATERAL (SELECT title, start_date FROM public."Experiment" e WHERE a."experimentId" = id) e,
            LATERAL (SELECT name FROM public."Condition" WHERE a."conditionId" = id) c,
            LATERAL (SELECT name FROM public."AssayType" WHERE a."typeId" = id) t
        
            WHERE TRUE
                ${maxDate !== undefined ? Prisma.sql`AND a.target_date < ${maxDate}` : Prisma.empty}
                ${minDate !== undefined ? Prisma.sql`AND a.target_date > ${minDate}` : Prisma.empty}
                ${includeRecorded ? Prisma.empty : Prisma.sql`AND a.result ISNULL`}
            ${orderBy !== undefined ? Prisma.raw(`ORDER BY ${orderBy.field} ${orderBy.order}`) : Prisma.empty}
            LIMIT ${pageSize} OFFSET ${page * pageSize}`,
        db.assay.count({
            where: {
                target_date: { gte: minDate, lte: maxDate },
                result: includeRecorded ? undefined : null
            }
        })
    ]);

    res.status(200).json({
        rows: assays,
        rowCount: totalRows
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
