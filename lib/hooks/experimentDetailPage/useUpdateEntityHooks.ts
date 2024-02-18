import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { updateAssay } from "@/lib/controllers/assayController";
import { updateAssayResult } from "@/lib/controllers/assayResultController";
import {
    setConditionAsControl,
    updateCondition,
} from "@/lib/controllers/conditionController";
import { updateExperiment } from "@/lib/controllers/experimentController";

export const useMutationToUpdateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation({
        mutationFn: updateAssayResult,
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
        mutationFn: updateAssay,
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
        mutationFn: updateCondition,
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
        mutationFn: updateExperiment,
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
        mutationFn: setConditionAsControl,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};
