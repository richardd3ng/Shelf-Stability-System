import { Assay, AssayResult, Condition } from "@prisma/client";
import { db } from "./db";

// note: these functions must be called on the server side they rely on the db object
export const assayHasResult = async (assayId: number): Promise<boolean> => {
    const assayResult: AssayResult | null = await db.assayResult.findFirst({
        where: {
            assayId: assayId,
        },
    });
    return assayResult !== null;
};

export const experimentHasAssaysWithResults = async (
    experimentId: number
): Promise<boolean> => {
    const assaysForExperiment: Assay[] = await db.assay.findMany({
        where: {
            experimentId: experimentId,
        },
    });
    for (let assay of assaysForExperiment) {
        if (await assayHasResult(assay.id)) {
            return true;
        }
    }
    return false;
};

export const conditionHasAssaysWithResults = async (
    conditionId: number
): Promise<boolean> => {
    const assaysWithCondition: Assay[] = await db.assay.findMany({
        where: {
            conditionId: conditionId,
        },
    });
    for (let assay of assaysWithCondition) {
        if (await assayHasResult(assay.id)) {
            return true;
        }
    }
    return false;
};

export const conditionIsControl = async (
    conditionId: number
): Promise<boolean> => {
    const controlCondition: Condition | null = await db.condition.findUnique({
        where: {
            id: conditionId,
            control: true,
        },
    });
    return controlCondition !== null;
};
