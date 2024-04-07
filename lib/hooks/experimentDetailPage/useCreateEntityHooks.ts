import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { createAssay } from "@/lib/controllers/assayController";
import { createAssayResult } from "@/lib/controllers/assayResultController";
import { createCondition } from "@/lib/controllers/conditionController";
import { createExperiment } from "@/lib/controllers/experimentController";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { Assay, Condition } from "@prisma/client";
import { createNewCustomAssayTypeForExperimentThroughAPI } from "@/lib/controllers/assayTypeController";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import {
    AssayCreationArgs,
    AssayResultCreationArgs,
    ConditionCreationArgs,
    ExperimentCreationResponse,
} from "@/lib/controllers/types";
import { useRouter } from "next/router";

export const useMutationToCreateExperiment = () => {
    const router = useRouter();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: createExperiment,
        onSuccess: (createdExperiment: ExperimentCreationResponse) => {
            showAlert(
                "success",
                `Succesfully created experiment ${createdExperiment.experiment.id}!`
            );
            router.push(`/experiments/${createdExperiment.experiment.id}`);
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: () => {
            showLoading("Creating experiment...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToCreateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: createCondition,
        onSuccess: (createdCondition: Condition) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert(
                "success",
                `Succesfully created condition ${createdCondition.name}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (conditionCreationArgs: ConditionCreationArgs) => {
            showLoading(`Creating condition ${conditionCreationArgs.name}...`);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToCreateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: createAssay,
        onSuccess: (createdAssay: Assay) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", `Succesfully created the assay!`);
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (_assayCreationArgs: AssayCreationArgs) => {
            showLoading(`Creating assay...`);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};

export const useMutationToCreateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: createAssayResult,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Succesfully updated assay data");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: (assayResultCreationArgs: AssayResultCreationArgs) => {
            const loadingText: string = `Updating assay ${
                assayResultCreationArgs.result !== undefined
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

export const useMutationToCreateCustomAssayType = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();

    return useMutation({
        mutationFn: createNewCustomAssayTypeForExperimentThroughAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Succesfully updated assay types data");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
        onMutate: () => {
            const loadingText: string = "Creating New Type";
            showLoading(loadingText);
        },
        onSettled: () => {
            hideLoading();
        },
    });
};
