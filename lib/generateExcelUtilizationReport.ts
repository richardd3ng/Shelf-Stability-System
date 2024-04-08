import { ExperimentInfo, UserInfo } from "./controllers/types";
import { utils, writeFile } from "xlsx/";
import { Assay, AssayResult, Condition } from "@prisma/client";
import { assayTypeIdToName, getAssayTypeUnits, getCorrespondingAssayType } from "./controllers/assayTypeController";
import { UtilizationReportRow } from "./controllers/types";
import { LocalDate } from "@js-joda/core";
import { ANISIDINE, FFA, HEXANAL, MOISTURE, PEROXIDE, SENSORY, standardAssayTypes } from "@/data/assayTypes";

export function generateExcelUtilizationReport(rows : UtilizationReportRow[], startDate : LocalDate, endDate : LocalDate) {
    const sheet1Data = getSheet1Data(startDate, endDate);
    const sheet2Data = getSheet2Data(rows);
    console.log(sheet2Data);
    const worksheet1 = utils.aoa_to_sheet(sheet1Data);
    const worksheet2 = utils.json_to_sheet(sheet2Data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, worksheet1, "Metadata");
    utils.book_append_sheet(wb, worksheet2, "Utilization");
    const fileTitle = `Lab_Utilization_Report.xlsx`
    writeFile(wb, fileTitle);
}

type Sheet1DataType = string | number | null;
function getSheet1Data(startDate : LocalDate, endDate : LocalDate): Sheet1DataType[][] {
    const data = [
        ["Title", "Lab Utilization Report"],
        ["Start Date", startDate.toString()],
        ["End Date", endDate.toString()],
        ["Report Generated", LocalDate.now().toString()]
    ];
    return data;
}

function getCountForTypeAndWeek (rows : UtilizationReportRow[], assayTypeName : string) : number {
    let count = 0;
    rows.filter((row : UtilizationReportRow) => row.assayTypeName === assayTypeName).forEach((row : UtilizationReportRow) => {
        count += row.count;
    });
    return count;
}

function getTotalCountNoTypeFilter (rows : UtilizationReportRow[]) : number {
    let count = 0;
    rows.forEach((row : UtilizationReportRow) => {
        count += row.count;
    });
    return count;
}


type OneRowOfSheet2Data = { [key: string]: any };
function getSheet2Data(rows : UtilizationReportRow[]): OneRowOfSheet2Data[] {
    let data: OneRowOfSheet2Data[] = [];
    rows.sort((row1 : UtilizationReportRow, row2 : UtilizationReportRow) => row1.weekStartDate.compareTo(row2.weekStartDate));
    let uniqueWeeks = Array.from(new Set(rows.map((row : UtilizationReportRow) => row.weekStartDate.toString())));
    uniqueWeeks.sort();
    uniqueWeeks.forEach((week : string) => {
        let rowsForWeek = rows.filter((row) => row.weekStartDate.toString() === week);
        data.push({
            "Week" : `${week} - ${LocalDate.parse(week).plusDays(6).toString()}`,
            [SENSORY.name] : getCountForTypeAndWeek(rowsForWeek, SENSORY.name),
            [MOISTURE.name] : getCountForTypeAndWeek(rowsForWeek, MOISTURE.name),
            [HEXANAL.name] : getCountForTypeAndWeek(rowsForWeek, HEXANAL.name),
            [FFA.name] : getCountForTypeAndWeek(rowsForWeek, FFA.name),
            [PEROXIDE.name] : getCountForTypeAndWeek(rowsForWeek, PEROXIDE.name),
            [ANISIDINE.name] : getCountForTypeAndWeek(rowsForWeek, ANISIDINE.name),
            "Other" : getCountForTypeAndWeek(rowsForWeek, "Other"),
            "Total" : getTotalCountNoTypeFilter(rowsForWeek)
        })
    })
    //need to push the totals
    data.push({
        "Week" : "Total",
        [SENSORY.name] : getCountForTypeAndWeek(rows, SENSORY.name),
        [MOISTURE.name] : getCountForTypeAndWeek(rows, MOISTURE.name),
        [HEXANAL.name] : getCountForTypeAndWeek(rows, HEXANAL.name),
        [FFA.name] : getCountForTypeAndWeek(rows, FFA.name),
        [PEROXIDE.name] : getCountForTypeAndWeek(rows, PEROXIDE.name),
        [ANISIDINE.name] : getCountForTypeAndWeek(rows, ANISIDINE.name),
        "Other" : getCountForTypeAndWeek(rows, "Other"),
        "Total" : getTotalCountNoTypeFilter(rows)

    })
    return data;

}
