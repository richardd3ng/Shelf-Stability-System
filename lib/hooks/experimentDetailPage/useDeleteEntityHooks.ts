import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { useExperimentId } from "./useExperimentId";
import { deleteCondition } from "@/lib/controllers/conditionController";
import { deleteAssay } from "@/lib/controllers/assayController";
import { deleteAssayResult } from "@/lib/controllers/assayResultController";
import { deleteExperiment } from "@/lib/controllers/experimentController";
import { useRouter } from "next/router";
import { AssayTypeForExperiment, Condition } from "@prisma/client";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { ExperimentWithLocalDate } from "@/lib/controllers/types";
import { deleteAssayTypeForExperimentThroughAPI } from "@/lib/controllers/assayTypeController";

export const useMutationToDeleteCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: (args: { id: number; confirm: boolean }) => {
            return deleteCondition(args.id, args.confirm);
        },
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
        mutationFn: (args: { id: number; confirm: boolean }) => {
            return deleteAssay(args.id, args.confirm);
        },
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

export const useMutationToDeleteAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: deleteAssayResult,
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
        mutationFn: (args: { id: number; confirm: boolean }) => {
            return deleteExperiment(args.id, args.confirm);
        },
        onSuccess: (experiment: ExperimentWithLocalDate) => {
            router.push("/experiment-list");
            showAlert(
                "success",
                `Succesfully deleted experiment ${experiment.id}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (args: { id: number; confirm: boolean }) => {
            showLoading(`Deleting experiment ${args.id}...`);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToDeleteAssayTypeForExperiment = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: deleteAssayTypeForExperimentThroughAPI,
        onSuccess: (_assayTypeForExperiment: AssayTypeForExperiment) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", `Succesfully deleted`);
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (_id: number) => {
            showLoading(`Deleting Assay Type`);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};
