import { useQueryClient, useMutation } from "react-query";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { deleteAssayType } from "@/lib/controllers/assayTypeController";
import { useExperimentId } from "./useExperimentId";
import { deleteCondition } from "@/lib/controllers/conditionController";
import { deleteAssayThroughAPI } from "@/lib/controllers/assayController";

type deleteFnType = (id : number) => Promise<void>;
const useMutationToDelteEntity = (deleteFn : deleteFnType) => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(deleteFn, {
        onSuccess : () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        }
    });

}

export const useMutationToDeleteAssayType = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(deleteAssayType, {
        onSettled : () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        }
    });
}

export const useMutationToDeleteCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(deleteCondition, {
        onSuccess : () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        }
    });
}

export const useMutationToDeleteAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation(deleteAssayThroughAPI, {
        onSuccess : () => {
            queryClient.invalidateQueries(getQueryKeyForUseExperimentInfo(experimentId));
        }
    });
}
