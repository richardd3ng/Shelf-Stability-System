import { NextApiRequest } from "next";
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

export const INVALID_EXPERIMENT_ID = -1;
export const getExperimentID = (req: NextApiRequest): number => {
    return req.query.experimentId
        ? Number(req.query.experimentId.toString())
        : INVALID_EXPERIMENT_ID;
};

export const INVALID_ASSAY_ID = -1;
export const getAssayID = (req: NextApiRequest): number => {
    return req.query.assayId
        ? Number(req.query.assayId.toString())
        : INVALID_ASSAY_ID;
};

export const INVALID_ASSAY_TYPE_ID = -1;
export const getAssayTypeID = (req: NextApiRequest): number => {
    return req.query.assayTypeId
        ? Number(req.query.assayTypeId.toString())
        : INVALID_ASSAY_TYPE_ID;
};

export const INVALID_CONDITION_ID = -1;
export const getConditionID = (req: NextApiRequest): number => {
    return req.query.conditionId
        ? Number(req.query.conditionId.toString())
        : INVALID_ASSAY_TYPE_ID;
};

export const INVALID_ASSAY_RESULT_ID = -1;
export const getAssayResultID = (req: NextApiRequest): number => {
    return req.query.assayResultId
        ? Number(req.query.assayResultId.toString())
        : INVALID_ASSAY_RESULT_ID;
};
