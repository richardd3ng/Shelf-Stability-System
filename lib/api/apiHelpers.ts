import { NextApiRequest } from "next";
import { INVALID_EXPERIMENT_ID } from "../hooks/useExperimentId";

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

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}
