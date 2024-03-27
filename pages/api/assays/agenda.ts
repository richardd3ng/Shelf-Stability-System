import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { AssayAgendaInfo, AssayAgendaTable } from "@/lib/controllers/types";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { LocalDate } from "@js-joda/core";
import { getToken } from "next-auth/jwt";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";
import { localDateToJsDate } from "@/lib/datesUtils";
import { requireQueryFields } from "@/lib/api/apiHelpers";

export default async function getAssays(
    req: NextApiRequest,
    res: NextApiResponse<AssayAgendaTable | ApiError>
) {
    const fields = requireQueryFields(
        req,
        ["min_date", "max_date", "page", "page_size", "sort_by", "sort_order"],
        {
            min_date: undefined,
            max_date: undefined,
            sort_by: "targetDate",
            sort_order: "asc",
        }
    );

    if (fields instanceof ApiError) {
        res.status(400).json(fields);
        return;
    }

    const { minDate, maxDate, page, pageSize, sortBy, sortOrder } = {
        ...fields,
        // Convert to LocalDate and back for validation
        minDate:
            fields.min_date === undefined
                ? undefined
                : localDateToJsDate(LocalDate.parse(fields.min_date)),
        maxDate:
            fields.max_date === undefined
                ? undefined
                : localDateToJsDate(LocalDate.parse(fields.max_date)),
        page: Number(fields.page),
        pageSize: Number(fields.page_size),
        sortBy: fields.sort_by,
        sortOrder: fields.sort_order,
    };

    if (isNaN(page) || isNaN(pageSize)) {
        res.status(400).json(getApiError(400, "Invalid page or page_size"));
        return;
    }

    const includeRecorded = req.query.include_recorded === "true";
    const token = await getToken({ req });
    const ownedAssaysOnly =
        req.query.owned_assays_only === "true" && token?.name !== undefined;

    // isCanceled = false is implicitly included in the view
    const whereCondition = {
        targetDate: {
            gte: minDate,
            lte: maxDate,
        },
        resultId: includeRecorded ? undefined : null,
        OR: ownedAssaysOnly
            ? [
                  {
                      owner: token.name ?? undefined,
                  },
                  {
                      technician: token.name ?? undefined,
                  },
              ]
            : undefined,
    };

    const queryRows = db.assayAgendaView
        .findMany({
            where: whereCondition,
            orderBy: {
                [sortBy]: sortOrder,
            },
            // Note: skipping requires going through all the records, so it's not efficient for large tables
            // https://www.prisma.io/docs/orm/prisma-client/queries/pagination
            skip: page * pageSize,
            take: pageSize,
        })
        .then<Omit<AssayAgendaInfo, "technicianTypes">[]>((assays) =>
            assays.map((assay) => dateFieldsToLocalDate(assay, ["targetDate"]))
        );

    const queryRowCount = db.assayAgendaView.count({
        where: whereCondition,
    });

    const [assays, totalRows] = await Promise.all([queryRows, queryRowCount]);

    // This is a little questionably done, but it works fine
    const assaysReal: AssayAgendaInfo[] = await Promise.all(
        assays.map(async (assay) =>
            assay.technician === null
                ? { ...assay, technicianTypes: null }
                : await db.assayTypeForExperiment
                      .findMany({
                          select: {
                              assayType: {
                                  select: {
                                      name: true,
                                  },
                              },
                          },
                          where: {
                              technician: {
                                  username: assay.technician,
                              },
                          },
                      })
                      .then((types) => ({
                          ...assay,
                          technicianTypes: types.map(
                              (type) => type.assayType.name
                          ),
                      }))
        )
    );

    res.status(200).json({
        rows: assaysReal,
        rowCount: totalRows,
    });
}
