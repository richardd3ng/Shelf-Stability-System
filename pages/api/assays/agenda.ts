import {db} from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { AssayInfo, AssayTable } from "@/lib/controllers/types";
import { Prisma } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";

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
        case "targetDate":
            field = "target_date";
        case "id":
        case "result":
            return {
                field: "a." + field,
                order: newOrder
            };
        case "type":
        case "condition":
        case "week":
            return {
                field: field,
                order: newOrder
            };
    }

    return undefined;
}

export default async function getAssays(req: NextApiRequest, res: NextApiResponse<AssayTable | ApiError>) {
    const minDate = req.query.minDate ? dayjs(req.query.minDate as string) : undefined;
    const maxDate = req.query.maxDate ? dayjs(req.query.maxDate as string) : undefined;
    const includeRecorded = req.query.include_recorded === "true";

    const orderBy = convertSort(req.query.sort_by, req.query.sort_order);
    var page;
    var pageSize;
    try {
        page = parseInt(req.query.page as string);
        pageSize = parseInt(req.query.page_size as string);
    } catch (error) {
        res.status(400).json(
            getApiError(400, "Invalid page or page_size")
        );
        return;
    }


    const [assays, totalRows] = await Promise.all([
        // TODO look at views instead?
        db.$queryRaw<AssayInfo[]>`SELECT a.id, a.target_date as "targetDate", e.title, a."experimentId" as "experimentId", c.name as condition, t.name as type, ROUND((CAST(a.target_date AS DATE) - CAST(e.start_date AS DATE)) / 7.0) as week, a.result
            
            FROM public."Assay" a,
            LATERAL (SELECT title, start_date FROM public."Experiment" e WHERE a."experimentId" = id) e,
            LATERAL (SELECT name FROM public."Condition" WHERE a."conditionId" = id) c,
            LATERAL (SELECT name FROM public."AssayType" WHERE a."typeId" = id) t
        
            WHERE TRUE
                ${maxDate !== undefined ? Prisma.sql`AND a.target_date <= ${maxDate.toDate()}` : Prisma.empty}
                ${minDate !== undefined ? Prisma.sql`AND a.target_date >= ${minDate.toDate()}` : Prisma.empty}
                ${includeRecorded ? Prisma.empty : Prisma.sql`AND a.result ISNULL`}
            ${orderBy !== undefined ? Prisma.raw(`ORDER BY ${orderBy.field} ${orderBy.order}`) : Prisma.empty}
            LIMIT ${pageSize} OFFSET ${page * pageSize}`
            // .then<AssayInfo[]>(assays => assays.map(assay => ({...assay, target_date: undefined, targetDate: assay.target_date})))
            ,
        db.assay.count({
            where: {
                target_date: { gte: minDate?.toDate(), lte: maxDate?.toDate() },
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