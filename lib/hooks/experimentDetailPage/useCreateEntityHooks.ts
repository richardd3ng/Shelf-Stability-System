import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { AssayTypeCreationArgs, ConditionCreationArgs } from "@/lib/controllers/types";
import { createAssayTypes } from "@/lib/controllers/assayTypeController";
import { createConditions } from "@/lib/controllers/conditionController";


const createAssayTypeMutationFn = async (assayTypeData : AssayTypeCreationArgs) => {
    await createAssayTypes([
        assayTypeData
    ]);
}
export const useMutationToCreateAssayType = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : createAssayTypeMutationFn,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
}

const createConditionMutationFn = async (conditionData : ConditionCreationArgs) => {
    await createConditions([
        conditionData
    ]);
}
export const useMutationToCreateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation( {
        mutationFn : createConditionMutationFn,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
}

