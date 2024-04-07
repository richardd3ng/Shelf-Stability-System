import { NextApiRequest } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "./error";
import { Experiment } from "@prisma/client";
import { ExperimentWithLocalDate } from "../controllers/types";
import { db } from "./db";

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

export const INVALID_ASSAY_ID = -1;
export const getAssayID = (req: NextApiRequest): number => {
    return req.query.assayId
        ? Number(req.query.assayId.toString())
        : INVALID_ASSAY_ID;
};

export const INVALID_ASSAY_RESULT_ID = -1;
export const getAssayResultID = (req: NextApiRequest): number => {
    return req.query.assayResultId
        ? Number(req.query.assayResultId.toString())
        : INVALID_ASSAY_RESULT_ID;
};

export const INVALID_CONDITION_ID = -1;
export const getConditionID = (req: NextApiRequest): number => {
    return req.query.conditionId
        ? Number(req.query.conditionId.toString())
        : INVALID_CONDITION_ID;
};

export const INVALID_EXPERIMENT_ID = -1;
export const getExperimentID = (req: NextApiRequest): number => {
    return req.query.experimentId
        ? Number(req.query.experimentId.toString())
        : INVALID_EXPERIMENT_ID;
};

export const INVALID_ASSAY_TYPE_ID = -1;

export const requireQueryFields = <K extends string>(
    req: NextApiRequest,
    fields: K[],
    defaults: Partial<{ [P in K]: string }>
): { [P in K]: string } | ApiError => {
    const missing: string[] = [];
    const result: { [P in K]: string } = {} as any;

    for (const field of fields) {
        const value = req.query[field];
        if (value === undefined) {
            if (field in defaults) {
                result[field] = defaults[field] as string;
            } else {
                missing.push(field);
            }
        } else {
            result[field] = value.toString();
        }
    }

    if (missing.length > 0) {
        return getApiError(
            400,
            `Missing required query fields: ${missing.join(", ")}`
        );
    }

    return result;
};

export const parseExperimentWeeks = (
    experiment: Experiment | ExperimentWithLocalDate
): number[] => {
    let weeks: number[] = [];
    experiment.weeks.split(",").forEach((week) => {
        if (week.trim() !== "") {
            weeks.push(Number(week));
        }
    });
    return weeks;
};

export const updateExperimentWeeks = async (
    experiment: Experiment,
    weeks: number[]
): Promise<void> => {
    try {
        await db.experiment.update({
            where: {
                id: experiment.id,
            },
            data: {
                weeks: weeks.join(","),
            },
        });
    } catch (error) {
        throw error;
    }
};
