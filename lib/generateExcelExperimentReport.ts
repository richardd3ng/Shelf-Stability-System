import { ExperimentInfo, UserInfo } from "./controllers/types";
import { utils, writeFile } from "xlsx/";
import { Assay, AssayResult, Condition } from "@prisma/client";
import { assayTypeIdToName, getAssayTypeUnits, getCorrespondingAssayType } from "./controllers/assayTypeController";

export function generateExcelReport(experimentInfo: ExperimentInfo, ownerUsername: string, allUsers: UserInfo[]) {
    const sheet1Data = getSheet1Data(experimentInfo, ownerUsername);
    const sheet2Data = getSheet2Data(experimentInfo, allUsers);
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
        ["Start Date", experimentInfo.experiment.startDate.toString()],
        ["Canceled", experimentInfo.experiment.isCanceled.toString().toLowerCase()],
    ];
    return data;
}

type OneRowOfSheet2Data = { [key: string]: any };
function getSheet2Data(experimentInfo: ExperimentInfo, allUsers: UserInfo[]): OneRowOfSheet2Data[] {
    let data: OneRowOfSheet2Data[] = [];
    experimentInfo.assays.sort((assay1: Assay, assay2: Assay) => assay1.week - assay2.week);
    experimentInfo.assays.forEach((assay: Assay) => {
        let assayResult = experimentInfo.assayResults.findLast((result: AssayResult) => result.assayId === assay.id);
        const techId = experimentInfo.assayTypes.find((type) => type.id === assay.assayTypeId)?.technicianId;
        data.push({
            "Week": assay.week,
            "Condition": experimentInfo.conditions.findLast((condition: Condition) => condition.id === assay.conditionId)?.name,
            "Assay Type": `${assayTypeIdToName(assay.assayTypeId, experimentInfo.assayTypes)}${getCorrespondingAssayType(assay.assayTypeId, experimentInfo.assayTypes)?.assayType.isCustom ? '*' : ''}`,
            "Result": assayResult?.result,
            "Units": assayResult?.result ? getAssayTypeUnits(assay.assayTypeId, experimentInfo.assayTypes) : null,
            "Last Edited User": assayResult?.author,
            "Comment": assayResult?.comment,
            "Technician": allUsers.find((user) => user.id === techId)?.username,
        })
    })
    return data;

}
