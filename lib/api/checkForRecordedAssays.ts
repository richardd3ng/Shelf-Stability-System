import { db } from "./db"

export const experimentHasAssaysWithResults = async (experimentId: number) => {
    const assaysWithRecordedResults = await db.assay.findMany({
        where: {
            AND: [
                {
                    experimentId: experimentId
                },
                {
                    NOT: {
                        result: null
                    }
                }
            ]
        }
    });

    return assaysWithRecordedResults.length > 0;
};

export const throwErrorIfExperimentHasAssaysWithResults = async (experimentId: number) => {
    if (await experimentHasAssaysWithResults(experimentId)) {
        throw new Error("This experiment has recorded assay results");
    }
};

export const throwErrorIfAssaysWithThisConditionHaveResult = async (conditionId: number) => {
    const assaysWithRecordedResults = await db.assay.findMany({
        where: {
            AND: [
                {
                    conditionId: conditionId
                },
                {
                    NOT: {
                        result: null
                    }
                }
            ]
        }
    });

    if (assaysWithRecordedResults.length > 0) {
        throw new Error("There are assays for this condition which have recorded results");
    }
}

export const throwErrorIfAssaysWithThisAssayTypeHaveResult = async (assayTypeId: number) => {
    const assaysWithRecordedResults = await db.assay.findMany({
        where: {
            AND: [
                {
                    typeId: assayTypeId
                },
                {
                    NOT: {
                        result: null
                    }
                }
            ]
        }
    });

    if (assaysWithRecordedResults.length > 0) {
        throw new Error("There are assays for this assay type which have recorded results");
    }
}

export const assayHasResult = async (assayId: number) => {
    const assay = await db.assay.findUnique({
        where: {
            id: assayId,
        }
    })

    return assay?.result !== null;
}

export const throwErrorIfAssayHasResult = async (assayId: number) => {
    if (await assayHasResult(assayId)) {
        throw new Error("This assay has a recorded result");
    }
}