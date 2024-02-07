import { useMutation, useQueryClient } from "react-query";
import { useExperimentId } from "./useExperimentId";
import { useExperimentInfo, getQueryKeyForUseExperimentInfo  } from "./experimentDetailHooks";
import { updateAssayResultThroughAPI } from "@/lib/controllers/assayController";
import { updateConditionThroughAPI } from "@/lib/controllers/conditionController";
import { updateAssayTypeThroughAPI } from "@/lib/controllers/assayTypeController";

export const useMutationToUpdateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(updateAssayResultThroughAPI, {
        onSuccess: () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        },
    });
};

export const useMutationToUpdateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(updateConditionThroughAPI, {
        onSuccess: () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        },
    });
};

export const useMutationToUpdateAssayType = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(updateAssayTypeThroughAPI, {
        onSuccess: () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        },
    });
};

