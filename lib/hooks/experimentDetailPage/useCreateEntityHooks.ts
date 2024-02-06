import { useQueryClient, useMutation } from "react-query";
import { useExperimentInfo } from "./experimentDetailHooks";
import { useExperimentId } from "./useExperimentId";
import { addNewConditionThroughAPI } from "@/lib/controllers/newConditionController";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { getDeepCopyOfExperimentInfo } from "./experimentDetailHooks";
import { AssayCreationData, AssayTypeCreationData, ConditionCreationData, ExperimentInfo } from "@/lib/controllers/types";
import { createAssayTypes } from "@/lib/controllers/assayTypeController";
import { createConditions } from "@/lib/controllers/conditionController";


const createAssayTypeMutationFn = async (assayTypeData : AssayTypeCreationData) => {
    await createAssayTypes([
        assayTypeData
    ]);
}
export const useMutationToCreateAssayType = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(createAssayTypeMutationFn, {
        onSuccess : () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        }
        
    })
}

const createConditionMutationFn = async (conditionData : ConditionCreationData) => {
    await createConditions([
        conditionData
    ]);
}
export const useMutationToCreateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(createConditionMutationFn, {
        onSuccess : () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        }
    })
}

