import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { AssayCreationArgs, AssayTypeCreationArgs, ConditionCreationArgs } from "@/lib/controllers/types";
import { createAssayTypes } from "@/lib/controllers/assayTypeController";
import { createConditions } from "@/lib/controllers/conditionController";
import { createAssays } from "@/lib/controllers/assayController";


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


const createAssayMutationFn = async (assayData : AssayCreationArgs) => {
    await createAssays([
        assayData
    ])
}
export const useMutationToCreateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation( {
        mutationFn : createAssayMutationFn,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
}

