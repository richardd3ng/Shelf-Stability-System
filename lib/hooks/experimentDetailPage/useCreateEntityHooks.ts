import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import {
    AssayCreationArgs,
    ConditionCreationArgs,
} from "@/lib/controllers/types";
import { createConditions } from "@/lib/controllers/conditionController";
import { createAssay } from "@/lib/controllers/assayController";

const createConditionMutationFn = async (
    conditionData: ConditionCreationArgs
) => {
    await createConditions([conditionData]);
};
export const useMutationToCreateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation({
        mutationFn: createConditionMutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

const createAssayMutationFn = async (assayData: AssayCreationArgs) => {
    await createAssay(assayData);
};
export const useMutationToCreateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation({
        mutationFn: createAssayMutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};
