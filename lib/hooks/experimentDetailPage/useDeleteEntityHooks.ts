import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { deleteAssayType } from "@/lib/controllers/assayTypeController";
import { useExperimentId } from "./useExperimentId";
import { deleteCondition } from "@/lib/controllers/conditionController";
import { deleteAssayResultThroughAPI, deleteAssayThroughAPI } from "@/lib/controllers/assayController";
import deleteAssayResultAPI from "@/pages/api/assays/[assayId]/deleteAssayResult";
import { deleteExperiment } from "@/lib/controllers/experimentController";
import { useRouter } from "next/router";
import { useAlert } from "@/lib/context/alert-context";

type deleteFnType = (id : number) => Promise<void>;
const useMutationToDelteEntity = (deleteFn : deleteFnType) => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : deleteFn,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })

}

export const useMutationToDeleteAssayType = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();

    return useMutation( {
        mutationFn : deleteAssayType,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
}

export const useMutationToDeleteCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : deleteCondition,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
}

export const useMutationToDeleteAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : deleteAssayThroughAPI,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
}

export const useMutationToDeleteAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation( {
        mutationFn : deleteAssayResultThroughAPI,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
        }
        
    })
}

export const useMutationToDeleteExperiment = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const router = useRouter();
    const {showAlert} = useAlert();
    return useMutation( {
        mutationFn : deleteExperiment,
        onSuccess : (experiment) => {
            showAlert("success",  "Deleted experiment " + experiment.id)
            router.push("/experiment-list")
        }
        
    })
}


