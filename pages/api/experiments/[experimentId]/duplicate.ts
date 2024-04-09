import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import {
    AssayTypeInfo,
    ExperimentCreationResponse,
    ExperimentInfo,
} from "@/lib/controllers/types";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { getExperimentID, INVALID_EXPERIMENT_ID } from "@/lib/api/apiHelpers";
import { createExperimentAPIHelper } from "../create";
import { fetchExperimentInfoAPIHelper } from "./fetchExperimentInfo";
import { Condition } from "@prisma/client";
import { createCustomAssayTypeAPIHelper } from "../../assayTypeForExperiment/createCustom";
import { createAssayAPIHelper } from "../../assays/create";
import { getStandardAssayTypesAPIHelper } from "../../assayTypeForExperiment/getAllStandardAssayTypes";

const getNewConditionId = (
    experimentInfo: ExperimentInfo,
    newConditions: Condition[],
    oldConditionId: number
): number => {
    const oldCondition = experimentInfo.conditions.find(
        (condition) => condition.id === oldConditionId
    );
    if (!oldCondition) {
        throw new ApiError(
            404,
            "Duplication error: old condition does not exist"
        );
    }
    const newCondition = newConditions.find(
        (condition) => condition.name === oldCondition.name
    );
    if (!newCondition) {
        throw new ApiError(
            404,
            "Duplication error: new condition does not exist"
        );
    }
    return newCondition.id;
};

const getNewAssayTypeForExperimentId = (
    experimentInfo: ExperimentInfo,
    newAssayTypeInfos: AssayTypeInfo[],
    oldAssayTypeForExperimentId: number
): number => {
    const oldAssayTypeInfo = experimentInfo.assayTypes.find(
        (assayType) => assayType.id === oldAssayTypeForExperimentId
    );
    if (!oldAssayTypeInfo) {
        throw new ApiError(
            404,
            "Duplication error: old assay type does not exist"
        );
    }
    const newAssayTypeInfo = newAssayTypeInfos.find(
        (newAssayTypeInfo) =>
            newAssayTypeInfo.assayType.name === oldAssayTypeInfo.assayType.name
    );
    if (!newAssayTypeInfo) {
        throw new ApiError(
            404,
            "Duplication error: new assay type does not exist"
        );
    }
    return newAssayTypeInfo.id;
};

const getDuplicateExperimentTitle = async (
    oldTitle: string
): Promise<string> => {
    const experiments = await db.experiment.findMany({
        where: {
            title: {
                startsWith: `${oldTitle} - copy`,
            },
        },
    });
    if (experiments.length === 0) {
        return `${oldTitle} - copy`;
    }
    const copyNumbers = experiments.map((experiment) => {
        const copyNumber = experiment.title
            .replace(`${oldTitle} - copy`, "")
            .trim();
        return copyNumber === "" ? 1 : parseInt(copyNumber);
    });
    return `${oldTitle} - copy ${Math.max(...copyNumbers) + 1}`;
};

export default async function duplicateExperimentAPI(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentCreationResponse | ApiError>
) {
    const permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }
    const id = getExperimentID(req);
    if (id === INVALID_EXPERIMENT_ID) {
        res.status(400).json(
            getApiError(400, "Valid Experiment ID is required.")
        );
        return;
    }
    try {
        const oldExperimentInfo = await fetchExperimentInfoAPIHelper(id);
        const standardAssayTypes = await getStandardAssayTypesAPIHelper();
        const newTitle = await getDuplicateExperimentTitle(
            oldExperimentInfo.experiment.title
        );
        const {
            experiment: newExperiment,
            conditions: newConditions,
            defaultAssayTypes: newAssayTypesForExperiment,
        } = await createExperimentAPIHelper(
            newTitle,
            oldExperimentInfo.experiment.description,
            oldExperimentInfo.experiment.startDate.toString(),
            oldExperimentInfo.conditions.map((condition) => ({
                name: condition.name,
                isControl: condition.isControl,
            })),
            oldExperimentInfo.experiment.ownerId,
            oldExperimentInfo.experiment.weeks
        );
        const newAssayTypeInfos: AssayTypeInfo[] = [];
        await Promise.all(
            oldExperimentInfo.assayTypes.map(async (assayTypeInfo) => {
                if (assayTypeInfo.assayType.isCustom) {
                    newAssayTypeInfos.push(
                        await createCustomAssayTypeAPIHelper(
                            newExperiment.id,
                            assayTypeInfo.assayType.name,
                            assayTypeInfo.assayType.description ?? undefined,
                            assayTypeInfo.assayType.units ?? undefined,
                            assayTypeInfo.technicianId ?? undefined
                        )
                    );
                } else {
                    const matchedStandardAssayType = standardAssayTypes.find(
                        (standardAssayType) =>
                            standardAssayType.id === assayTypeInfo.assayTypeId
                    );
                    if (!matchedStandardAssayType) {
                        throw new ApiError(
                            404,
                            "Duplication error: matching standard assay type not found"
                        );
                    }
                    const matchedStandardAssayTypeForExperiment =
                        newAssayTypesForExperiment.find(
                            (assayType) =>
                                assayType.assayTypeId ===
                                assayTypeInfo.assayTypeId
                        );
                    if (!matchedStandardAssayTypeForExperiment) {
                        throw new ApiError(
                            404,
                            "Duplication error: matching standard assay type for experiment not found"
                        );
                    }
                    await db.assayTypeForExperiment.update({
                        where: {
                            id: matchedStandardAssayTypeForExperiment.id,
                        },
                        data: {
                            technicianId: assayTypeInfo.technicianId,
                        },
                    });
                    newAssayTypeInfos.push({
                        ...matchedStandardAssayTypeForExperiment,
                        assayType: matchedStandardAssayType,
                    });
                }
            })
        );
        await Promise.all(
            oldExperimentInfo.assays.map(async (assay, index) => {
                await createAssayAPIHelper(
                    newExperiment.id,
                    getNewConditionId(
                        oldExperimentInfo,
                        newConditions,
                        assay.conditionId
                    ),
                    getNewAssayTypeForExperimentId(
                        oldExperimentInfo,
                        newAssayTypeInfos,
                        assay.assayTypeId
                    ),
                    assay.week,
                    index + 1
                );
            })
        );
        res.status(200).json({
            experiment: newExperiment,
            conditions: newConditions,
            defaultAssayTypes: newAssayTypesForExperiment,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(
                getApiError(error.statusCode, error.message)
            );
            return;
        }
        res.status(500).json(
            getApiError(500, `Failed to duplicate experiment ${id} on server`)
        );
    }
}
