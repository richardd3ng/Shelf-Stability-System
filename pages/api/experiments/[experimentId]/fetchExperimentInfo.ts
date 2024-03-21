import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    ExperimentInfo,
    ExperimentWithLocalDate,
    AssayTypeInfo
} from "@/lib/controllers/types";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { Assay, AssayResult, AssayTypeForExperiment, Condition, Experiment } from "@prisma/client";
import { getExperimentID, INVALID_EXPERIMENT_ID } from "@/lib/api/apiHelpers";
import { JSONToExperiment, dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";

export default async function getExperimentInfoAPI(
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
        const [experiment, conditions, assays, assayTypes]: [
            ExperimentWithLocalDate | null,
            Condition[],
            Assay[],
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
            }),
            db.assayTypeForExperiment.findMany({
                where : { experimentId : id},
                include : {
                    assayType : true
                }
            })
        ]);
        
        if (!experiment) {
            res.status(404).json(
                getApiError(
                    404,
                    `Experiment ${id} does not exist`,
                    "Experiment Not Found"
                )
            );
            return;
        }
        const experimentAssayResults: AssayResult[] = [];
        await Promise.all(
            assays.map(async (assay: Assay) => {
                const assayResults: AssayResult[] =
                    await db.assayResult.findMany({
                        where: { assayId: assay.id },
                    });
                experimentAssayResults.push(...assayResults);
            })
        );
        res.status(200).json({
            experiment: JSONToExperiment(
                JSON.parse(JSON.stringify(experiment))
            ),
            conditions: conditions,
            assays: assays,
            assayResults: experimentAssayResults,
            assayTypes : assayTypes
        });
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
