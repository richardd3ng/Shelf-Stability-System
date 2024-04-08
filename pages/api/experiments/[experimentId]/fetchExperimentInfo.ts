import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    ExperimentInfo,
    ExperimentWithLocalDate,
    AssayTypeInfo,
    AssayWithResult,
} from "@/lib/controllers/types";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import {
    Assay,
    AssayResult,
    AssayTypeForExperiment,
    Condition,
    Experiment,
} from "@prisma/client";
import { getExperimentID, INVALID_EXPERIMENT_ID } from "@/lib/api/apiHelpers";
import {
    JSONToExperiment,
    dateFieldsToLocalDate,
} from "@/lib/controllers/jsonConversions";

export const fetchExperimentInfoAPIHelper = async (
    id: number
): Promise<ExperimentInfo> => {
    const [experiment, conditions, assays, assayTypes]: [
        ExperimentWithLocalDate | null,
        Condition[],
        AssayWithResult[],
        AssayTypeInfo[]
    ] = await Promise.all([
        db.experiment
            .findUnique({
                where: { id: id },
            })
            .then((experiment: Experiment | null) => {
                if (!experiment) {
                    return null;
                }
                return dateFieldsToLocalDate(experiment, ["startDate"]);
            }),
        db.condition.findMany({
            where: { experimentId: id },
        }),
        db.assay.findMany({
            where: { experimentId: id },
            include: {
                result: true,
            },
        }),
        db.assayTypeForExperiment.findMany({
            where: { experimentId: id },
            include: {
                assayType: true,
            },
        }),
    ]);
    const experimentAssayResults: AssayResult[] = [];
    assays.forEach((assay) => {
        if (assay.result) {
            experimentAssayResults.push(assay.result);
        }
    });
    return {
        experiment: JSONToExperiment(JSON.parse(JSON.stringify(experiment))),
        conditions: conditions,
        assays: assays.map((assay) => ({ ...assay, result: undefined })),
        assayResults: experimentAssayResults,
        assayTypes: assayTypes,
    };
};

export default async function fetchExperimentInfoAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentInfo | ApiError>
) {
    const id = getExperimentID(req);
    if (id === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    try {
        res.status(200).json(await fetchExperimentInfoAPIHelper(id));
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(
                500,
                `Failed to fetch details for experiment ${id} on server`
            )
        );
    }
}
