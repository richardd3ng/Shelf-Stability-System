import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { updateAssay } from "@/lib/controllers/assayController";
import { updateAssayResult } from "@/lib/controllers/assayResultController";
import {
    setConditionAsControl,
    updateCondition,
} from "@/lib/controllers/conditionController";
import {
    cancelExperiment,
    updateExperiment,
} from "@/lib/controllers/experimentController";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { Assay, Condition } from "@prisma/client";
import {
    AssayResultUpdateArgs,
    ExperimentUpdateArgs,
    ExperimentWithLocalDate,
} from "@/lib/controllers/types";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";

export const useMutationToUpdateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: updateAssayResult,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Succesfully updated assay data");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (assayResultUpdateArgs: AssayResultUpdateArgs) => {
            const action: string =
                assayResultUpdateArgs.result === null ||
                assayResultUpdateArgs.comment === null
                    ? "Deleting"
                    : "Updating";
            const loadingText: string = `${action} assay ${
                assayResultUpdateArgs.result !== undefined
                    ? "result"
                    : "comment"
            }...`;
            showLoading(loadingText);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToUpdateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: updateAssay,
        onSuccess: (_updatedAssay: Assay) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", `Succesfully updated assay`);
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: () => {
            showLoading("Updating assay...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToUpdateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: updateCondition,
        onSuccess: (updatedCondition: Condition) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert(
                "success",
                `Succesfully changed condition to ${updatedCondition.name}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: () => {
            showLoading("Updating condition...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToUpdateExperiment = () => {
    const queryClient = useQueryClient();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: updateExperiment,
        onSuccess: (updatedExperiment: ExperimentWithLocalDate) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(updatedExperiment.id),
            });
            showAlert(
                "success",
                `Succesfully updated experiment ${updatedExperiment.id}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (experimentUpdateArgs: ExperimentUpdateArgs) => {
            showLoading(`Updating experiment ${experimentUpdateArgs.id}...`);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToCancelExperiment = () => {
    const queryClient = useQueryClient();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: cancelExperiment,
        onSuccess: (canceledExperiment: ExperimentWithLocalDate) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(
                    canceledExperiment.id
                ),
            });
            showAlert(
                "success",
                `Succesfully cancelled experiment ${canceledExperiment.id}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (id: number) => {
            showLoading(`Cancelling experiment ${id}...`);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToSetConditionAsControl = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: setConditionAsControl,
        onSuccess: (updatedCondition: Condition) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert(
                "success",
                `Succesfully set ${updatedCondition.name} as control`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: () => {
            showLoading("Setting condition as control...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};
