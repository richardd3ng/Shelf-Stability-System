import { db } from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    ExperimentInfo,
    ExperimentOwner,
    ExperimentWithLocalDate,
} from "@/lib/controllers/types";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { Assay, AssayResult, Condition, Experiment } from "@prisma/client";
import { getExperimentID, INVALID_EXPERIMENT_ID } from "@/lib/api/apiHelpers";
import { JSONToExperiment } from "@/lib/controllers/jsonConversions";
import { nativeJs } from "@js-joda/core";
import { localDateToJsDate } from "@/lib/datesUtils";

export default async function getExperimentOwnerAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentOwner | ApiError>
) {
    const id = getExperimentID(req);
    if (id === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    try{
        const experiment = await db.experiment.findUnique({
            where : {
                id : id
            },
            include : {
                owner : true
            }
        });
        if (experiment){
            res.status(200).json({username : experiment.owner.username})
        }
    } catch {
        res.status(400).json(
            getApiError(400, "An error occurred.")
        );
    }
}
