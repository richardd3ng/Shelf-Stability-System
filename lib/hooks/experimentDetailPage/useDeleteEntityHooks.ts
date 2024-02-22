import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { useExperimentId } from "./useExperimentId";
import { deleteCondition } from "@/lib/controllers/conditionController";
import { deleteAssay } from "@/lib/controllers/assayController";
import { deleteAssayResult } from "@/lib/controllers/assayResultController";
import { deleteExperiment } from "@/lib/controllers/experimentController";
import { useRouter } from "next/router";
import { useAlert } from "@/lib/context/shared/alertContext";
import { AssayResult, Condition } from "@prisma/client";
import { ExperimentWithLocalDate } from "@/lib/controllers/types";
import { getErrorMessage } from "@/lib/api/apiHelpers";

export const useMutationToDeleteCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    return useMutation({
        mutationFn: deleteCondition,
        onSuccess: (condition: Condition) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert(
                "success",
                `Succesfully deleted condition ${condition.name}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};

export const useMutationToDeleteAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    return useMutation({
        mutationFn: deleteAssay,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Succesfully deleted assay");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};

const deleteAssayResultMutationFn = async (
    assayResultId: number
): Promise<AssayResult> => {
    return await deleteAssayResult(assayResultId);
};
export const useMutationToDeleteAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    return useMutation({
        mutationFn: deleteAssayResultMutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Deleted assay result");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};

const deleteExperimentMutationFn = async (
    id: number
): Promise<ExperimentWithLocalDate> => {
    return await deleteExperiment(id);
};
export const useMutationToDeleteExperiment = () => {
    const router = useRouter();
    const { showAlert } = useAlert();
    return useMutation({
        mutationFn: deleteExperimentMutationFn,
        onSuccess: (experiment) => {
            router.push("/experiment-list");
            showAlert(
                "success",
                `Succesfully deleted experiment ${experiment.id}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};
