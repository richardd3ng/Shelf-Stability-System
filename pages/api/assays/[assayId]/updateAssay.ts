import { getAssayID } from "@/lib/api/apiHelpers";
import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { assayHasResult } from "@/lib/api/checkForRecordedAssays";
import { LocalDate } from "@js-joda/core";

export default async function updateAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
) {
    try {
        const assayId = getAssayID(req);
        const jsonData = req.body;
        const newResult = jsonData.result;
        const shouldUpdateTargetDate = jsonData.shouldUpdateTargetDate;
        if (shouldUpdateTargetDate && await assayHasResult(assayId)) {
            res.status(400).json(getApiError(400, "Assay has a recorded result, so the date cannot be changed."));
            return;
        }

        const updatedAssay: Assay = await db.assay.update({
            where: {
                id: assayId,
            },
            data: {
                result: newResult,
                // Parse and re-format in order to validate it
                target_date: shouldUpdateTargetDate ? LocalDate.parse(jsonData.targetDate).toString() : undefined,
            },
        });

        res.status(200).json(updatedAssay);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to update assay result on server")
        );
    }
}
