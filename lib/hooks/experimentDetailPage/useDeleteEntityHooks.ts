import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { useExperimentId } from "./useExperimentId";
import { deleteCondition } from "@/lib/controllers/conditionController";
import { deleteAssay } from "@/lib/controllers/assayController";
import { deleteAssayResult } from "@/lib/controllers/assayResultController";
import { deleteExperiment } from "@/lib/controllers/experimentController";
import { useRouter } from "next/router";
import { AssayResult, Condition } from "@prisma/client";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";

export const useMutationToDeleteCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

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
        onMutate: () => {
            showLoading("Deleting condition...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToDeleteAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

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
        onMutate: () => {
            showLoading("Deleting assay...");
        },
        onSettled: () => {
            hideLoading();
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
    const { showLoading, hideLoading } = useLoading();

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
        onMutate: () => {
            showLoading("Deleting assay result...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToDeleteExperiment = () => {
    const router = useRouter();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: deleteExperiment,
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
        onMutate: (id: number) => {
            showLoading(`Deleting experiment ${id}...`);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};
