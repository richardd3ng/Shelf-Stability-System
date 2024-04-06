import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { CONSTRAINT_ERROR_CODE, getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { parseExperimentWeeks, updateExperimentWeeks } from "@/lib/api/apiHelpers";
import { localDateToJsDate } from "@/lib/datesUtils";
import { LocalDate } from "@js-joda/core";


export default async function createAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }

    //let {startDate, endDate} = req.body;
    let startDateStr = LocalDate.parse("2024-01-01").toString();
    let endDateStr =LocalDate.parse("2024-08-08").toString();
    let startDate = localDateToJsDate(LocalDate.parse(startDateStr));
    let endDate = localDateToJsDate(LocalDate.parse(endDateStr));

    const roundedStartDate = startDate;
    const roundedEndDate = endDate;
    //round these dates!

    const data : any[] = await db.$queryRaw`
    WITH assayTypesCombined as (
        SELECT ast."isCustom", atfe.id as "assayTypeForExperimentId", name, ast.id as "assayTypeId"
        FROM public."AssayTypeForExperiment" as atfe
        INNER JOIN public."AssayType" as ast
        ON atfe."assayTypeId" = ast.id
    ),
    assaysWithTypes as (
        SELECT assayTypesCombined."isCustom", assayTypesCombined.name, assay.id as "assayId", assay.week, assay."experimentId"
        FROM public."Assay" as assay
        INNER JOIN assayTypesCombined
        ON assayTypesCombined."assayTypeForExperimentId" = assay."assayTypeId"
    ),
    assaysWithTypesAndExperimentStartDate as (
        SELECT assaysWithTypes."isCustom", assaysWithTypes.name, assaysWithTypes."assayId" as "assayId", assaysWithTypes.week, experiment."startDate" as "experimentStartDate" 
        FROM assaysWithTypes
        INNER JOIN public."Experiment" as experiment
        ON assaysWithTypes."experimentId" = experiment.id
    ),
    assaysWithTypesAndTargetDate as (
        SELECT *, CAST("experimentStartDate" + interval '7' day * week AS DATE) as "targetDate"
        FROM assaysWithTypesAndExperimentStartDate
    ),
    assaysWithTypesAndRoundedDownTargetDate AS (
        SELECT *, date_trunc('week', "targetDate") - interval '1 day' AS "sundayPriorToTargetDate"
        FROM assaysWithTypesAndTargetDate
    )
    SELECT COUNT("assayId") as "count", "sundayPriorToTargetDate", "name"
    FROM assaysWithTypesAndRoundedDownTargetDate
    WHERE "sundayPriorToTargetDate" <= ${roundedEndDate} AND "sundayPriorToTargetDate" >= ${roundedStartDate}
    GROUP BY "name", "sundayPriorToTargetDate";
    `;


    res.status(200).json(data.map((row) => {
        let intCount : string = row.count.toString();
        return {
            ...row,
            count : parseInt(intCount)
        }
    }));

    
}


