import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { useExperimentId } from "./useExperimentId";
import { deleteCondition } from "@/lib/controllers/conditionController";
import { deleteAssay } from "@/lib/controllers/assayController";
import { deleteAssayResult } from "@/lib/controllers/assayResultController";
import { deleteExperiment } from "@/lib/controllers/experimentController";
import { useRouter } from "next/router";
import { useAlert } from "@/lib/context/alert-context";

export const useMutationToDeleteCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation({
        mutationFn: deleteCondition,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

export const useMutationToDeleteAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation({
        mutationFn: deleteAssay,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

export const useMutationToDeleteAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    return useMutation({
        mutationFn: deleteAssayResult,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
        },
    });
};

export const useMutationToDeleteExperiment = () => {
    const router = useRouter();
    const { showAlert } = useAlert();
    return useMutation({
        mutationFn: deleteExperiment,
        onSuccess: (experiment) => {
            showAlert("success", "Deleted experiment " + experiment.id);
            router.push("/experiment-list");
        },
    });
};
