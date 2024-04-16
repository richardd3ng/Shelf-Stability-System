import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { localDateToJsDate } from "@/lib/datesUtils";
import { DayOfWeek, LocalDate } from "@js-joda/core";
import { getApiError } from "@/lib/api/error";


export default async function utilizationAPI(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{

        let startDateStr = typeof(req.query.startdate) === "string" ? req.query.startdate : LocalDate.now().toString();
        let endDateStr = typeof(req.query.enddate) === "string" ? req.query.enddate : LocalDate.now().toString();
        let startLocalDate = LocalDate.parse(startDateStr);
        let endLocalDate = LocalDate.parse(endDateStr);

        let roundedStartLocalDate = startLocalDate.plusDays(( DayOfWeek.SUNDAY.compareTo(startLocalDate.dayOfWeek()) - 7) % 7);
        let roundedEndLocalDate = endLocalDate.plusDays(( DayOfWeek.SUNDAY.compareTo(endLocalDate.dayOfWeek()) - 7) % 7 );
    
        const roundedStartDate = localDateToJsDate(roundedStartLocalDate);
        const roundedEndDate = localDateToJsDate(roundedEndLocalDate);

        const standardTypesData : any[] = await db.$queryRaw`
            WITH assayTypesCombined as (
                SELECT ast."isCustom", atfe.id as "assayTypeForExperimentId", name as "assayTypeName", ast.id as "assayTypeId"
                FROM public."AssayTypeForExperiment" as atfe
                INNER JOIN public."AssayType" as ast
                ON atfe."assayTypeId" = ast.id
                WHERE ast."isCustom" = False
            ),
            assaysWithTypes as (
                SELECT assayTypesCombined."isCustom", assayTypesCombined."assayTypeName", assay.id as "assayId", assay.week, assay."experimentId"
                FROM public."Assay" as assay
                INNER JOIN assayTypesCombined
                ON assayTypesCombined."assayTypeForExperimentId" = assay."assayTypeId"
            ),
            assaysWithTypesAndExperimentStartDate as (
                SELECT assaysWithTypes."isCustom", assaysWithTypes."assayTypeName", assaysWithTypes."assayId" as "assayId", assaysWithTypes.week, experiment."startDate" as "experimentStartDate" 
                FROM assaysWithTypes
                INNER JOIN public."Experiment" as experiment
                ON assaysWithTypes."experimentId" = experiment.id
                WHERE experiment."isCanceled" = False
            ),
            assaysWithTypesAndTargetDate as (
                SELECT *, CAST("experimentStartDate" + interval '7' day * week AS DATE) as "targetDate"
                FROM assaysWithTypesAndExperimentStartDate
            ),
            assaysWithTypesAndRoundedDownTargetDate AS (
                SELECT 
                    *,
                    CASE 
                        WHEN extract(dow FROM "targetDate") = 0 THEN "targetDate"  
                        ELSE "targetDate" - (extract(dow FROM "targetDate") * interval '1 day')
                    END AS "weekStartDate"
                FROM assaysWithTypesAndTargetDate
            )
            SELECT COUNT("assayId") as "count", "weekStartDate", "assayTypeName"
            FROM assaysWithTypesAndRoundedDownTargetDate
            WHERE "weekStartDate" <= ${roundedEndDate} AND "weekStartDate" >= ${roundedStartDate}
            GROUP BY "assayTypeName", "weekStartDate";
        `;

        const customTypesData : any[] = await db.$queryRaw`
            WITH assayTypesCombined as (
                SELECT ast."isCustom", atfe.id as "assayTypeForExperimentId", name as "assayTypeName", ast.id as "assayTypeId"
                FROM public."AssayTypeForExperiment" as atfe
                INNER JOIN public."AssayType" as ast
                ON atfe."assayTypeId" = ast.id
                WHERE ast."isCustom" = True
            ),
            assaysWithTypes as (
                SELECT assayTypesCombined."isCustom", assayTypesCombined."assayTypeName", assay.id as "assayId", assay.week, assay."experimentId"
                FROM public."Assay" as assay
                INNER JOIN assayTypesCombined
                ON assayTypesCombined."assayTypeForExperimentId" = assay."assayTypeId"
            ),
            assaysWithTypesAndExperimentStartDate as (
                SELECT assaysWithTypes."isCustom", assaysWithTypes."assayTypeName", assaysWithTypes."assayId" as "assayId", assaysWithTypes.week, experiment."startDate" as "experimentStartDate" 
                FROM assaysWithTypes
                INNER JOIN public."Experiment" as experiment
                ON assaysWithTypes."experimentId" = experiment.id
                WHERE experiment."isCanceled" = False
            ),
            assaysWithTypesAndTargetDate as (
                SELECT *, CAST("experimentStartDate" + interval '7' day * week AS DATE) as "targetDate"
                FROM assaysWithTypesAndExperimentStartDate
            ),
            assaysWithTypesAndRoundedDownTargetDate AS (
                SELECT 
                    *,
                    CASE 
                        WHEN extract(dow FROM "targetDate") = 0 THEN "targetDate"  
                        ELSE "targetDate" - (extract(dow FROM "targetDate") * interval '1 day')
                    END AS "weekStartDate"
                FROM assaysWithTypesAndTargetDate
            )
            SELECT COUNT("assayId") as "count", "weekStartDate"
            FROM assaysWithTypesAndRoundedDownTargetDate
            WHERE "weekStartDate" <= ${roundedEndDate} AND "weekStartDate" >= ${roundedStartDate}
            GROUP BY "weekStartDate";
        `;

        const data = [...standardTypesData, ...(customTypesData.map((row) => {
            return {
                ...row,
                assayTypeName : "Other"
            }
        }))].map((row) => {
            return {
                ...row,
                weekStartDate : LocalDate.parse(formatDateToISO(row.weekStartDate))
            }
        });


        res.status(200).json(data.map((row) => {
            let intCount : string = row.count.toString();
            return {
                ...row,
                count : parseInt(intCount)
            }
        }));
    } catch (error) {
        console.log(error);
        res.status(500).json(
            getApiError(500, "Failed to get utilization data")
        );
    }

    
}

function formatDateToISO(date : Date) {
    let isoDate = date.toISOString().split("-");
    return `${isoDate[0]}-${isoDate[1]}-${isoDate[2].substring(0, 2)}`;
}
  
