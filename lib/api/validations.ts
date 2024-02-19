import { Assay, AssayResult, Condition } from "@prisma/client";
import { db } from "./db";

export const experimentHasAssaysWithResults = async (
    experimentId: number
): Promise<boolean> => {
    const assayWithResult: Assay | null = await db.assay.findFirst({
        where: {
            AND: [
                {
                    experimentId: experimentId,
                },
                {
                    NOT: {
                        result: null,
                    },
                },
            ],
        },
    });
    return assayWithResult !== null;
};

export const conditionHasAssaysWithResults = async (
    conditionId: number
): Promise<boolean> => {
    const assayWithResult: Assay | null = await db.assay.findFirst({
        where: {
            AND: [
                {
                    conditionId: conditionId,
                },
                {
                    NOT: {
                        result: null,
                    },
                },
            ],
        },
    });
    return assayWithResult !== null;
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

export const assayHasResult = async (assayId: number): Promise<boolean> => {
    const assayResult: AssayResult | null = await db.assayResult.findFirst({
        where: {
            id: assayId,
        },
    });
    return assayResult !== null;
};
