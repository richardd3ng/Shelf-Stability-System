import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { useExperimentInfo, getQueryKeyForUseExperimentInfo  } from "./experimentDetailHooks";
import { updateAssayResultThroughAPI } from "@/lib/controllers/assayController";
import { updateConditionThroughAPI } from "@/lib/controllers/conditionController";
import { updateAssayTypeThroughAPI } from "@/lib/controllers/assayTypeController";
import { UpdateExperimentArgs, updateExperimentThroughAPI } from "@/lib/controllers/experimentController";

export const useMutationToUpdateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : updateAssayResultThroughAPI,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
};

export const useMutationToUpdateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : updateConditionThroughAPI,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
};

export const useMutationToUpdateAssayType = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : updateAssayTypeThroughAPI,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
};



export const useMutationToUpdateExperiment = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation( {
        mutationFn : updateExperimentThroughAPI,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
};

