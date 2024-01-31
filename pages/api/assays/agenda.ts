import {db} from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { AssayInfo } from "@/lib/controllers/types";
import { getNumWeeksAfterStartDate } from "@/lib/datesUtils";

export default async function getAssays(req: NextApiRequest, res: NextApiResponse<AssayInfo[]>) {
    const minDate = req.query.minDate ? new Date(req.query.minDate as string) : undefined;
    const maxDate = req.query.maxDate ? new Date(req.query.maxDate as string) : undefined;
    
    const assays: AssayInfo[] = await db.assay.findMany({
        select: {
            id: true,
            target_date: true,
            condition: true,
            type: true,
            experiment: true,
            result: true
        },
        where: { target_date: { gte: minDate, lte: maxDate } },
    }).then(assays =>
        assays.map(assay => ({
            id: assay.id,
            targetDate: assay.target_date,
            title: assay.experiment.title,
            condition: assay.condition.name,
            type: assay.type.name,
            week: getNumWeeksAfterStartDate(assay.experiment.start_date, assay.target_date)
        }))
    );

    res.status(200).json(assays);
}