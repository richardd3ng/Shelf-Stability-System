import { ExperimentInfo } from "./controllers/types";
import { utils, writeFile } from "xlsx/";
import { Assay, AssayResult, Condition } from "@prisma/client";
import { assayTypeIdToName, getAssayTypeUnits } from "./controllers/assayTypeController";

export function generateExcelReport(experimentInfo: ExperimentInfo, ownerUsername: string) {
    const sheet1Data = getSheet1Data(experimentInfo, ownerUsername);
    const sheet2Data = getSheet2Data(experimentInfo);
    const worksheet1 = utils.aoa_to_sheet(sheet1Data);
    const worksheet2 = utils.json_to_sheet(sheet2Data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, worksheet1, "Metadata");
    utils.book_append_sheet(wb, worksheet2, "Assays");
    const fileTitle = `Experiment_${experimentInfo.experiment.id}.xlsx`
    writeFile(wb, fileTitle);
}

type Sheet1DataType = string | number | null;
function getSheet1Data(experimentInfo: ExperimentInfo, ownerUsername: string): Sheet1DataType[][] {
    const data = [
        ["Title", experimentInfo.experiment.title],
        ["ID", experimentInfo.experiment.id],
        ["Owner", ownerUsername],
        ["Description", experimentInfo.experiment.description],
        ["Start Date", experimentInfo.experiment.start_date.toString()]

    ];
    return data;
}

type OneRowOfSheet2Data = { [key: string]: any };
function getSheet2Data(experimentInfo: ExperimentInfo): OneRowOfSheet2Data[] {
    let data: OneRowOfSheet2Data[] = [];
    experimentInfo.assays.sort((assay1: Assay, assay2: Assay) => assay1.week - assay2.week);
    experimentInfo.assays.forEach((assay: Assay) => {
        let assayResult = experimentInfo.assayResults.findLast((result: AssayResult) => result.assayId === assay.id);
        data.push({
            "Week": assay.week,
            "Condition": experimentInfo.conditions.findLast((condition: Condition) => condition.id === assay.conditionId)?.name,
            "Assay Type": assayTypeIdToName(assay.type),
            "Result": assayResult?.result,
            "Units": assayResult?.result ? getAssayTypeUnits(assay.type) : null,
            "Last Edited User": assayResult?.last_editor,
            "Comment": assayResult?.comment
        })
    })
    return data;

}
