import { db } from "./db";

export async function getExperimentIdForCondition(conditionId : number) : Promise<number>{
    const condition = await db.condition.findUnique({
        where : {
            id : conditionId
        }
    });
    if (condition){
        return condition.experimentId;
    } else {
        throw new Error("Condition does not exist");
    }
}

export async function getExperimentIdForAssay(assayId : number) : Promise<number>{
    const assay = await db.assay.findUnique({
        where : {
            id : assayId
        }
    });
    if (assay){
        return assay.experimentId;
    } else {
        throw new Error("Assay does not exist");
    }
}

export async function getExperimentIdForAssayResult(assayResultId : number) : Promise<number>{
    const assayResult = await db.assayResult.findUnique({
        where : {
            id : assayResultId
        }
    });
    if (assayResult){
        return await getExperimentIdForAssay(assayResult.assayId);
    } else {
        throw new Error("Assay Result does not exist");
    }
}