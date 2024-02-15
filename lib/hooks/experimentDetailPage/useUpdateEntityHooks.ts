import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import {
    updateAssayResultThroughAPI,
    updateAssayThroughAPI,
} from "@/lib/controllers/assayController";
import {
    makeConditionTheControlThroughAPI,
    updateConditionThroughAPI,
} from "@/lib/controllers/conditionController";
import { updateExperimentThroughAPI } from "@/lib/controllers/experimentController";

export const useMutationToUpdateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation({
        mutationFn: updateAssayResultThroughAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

export const useMutationToUpdateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation({
        mutationFn: updateAssayThroughAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

export const useMutationToUpdateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation({
        mutationFn: updateConditionThroughAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

export const useMutationToUpdateExperiment = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation({
        mutationFn: updateExperimentThroughAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

export const useMutationToMakeConditionTheControl = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation({
        mutationFn: makeConditionTheControlThroughAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};
