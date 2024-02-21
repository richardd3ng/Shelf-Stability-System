import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { updateAssay } from "@/lib/controllers/assayController";
import { updateAssayResult } from "@/lib/controllers/assayResultController";
import {
    setConditionAsControl,
    updateCondition,
} from "@/lib/controllers/conditionController";
import { updateExperiment } from "@/lib/controllers/experimentController";
import { useAlert } from "@/lib/context/alert-context";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { Assay, Condition } from "@prisma/client";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";
import { ExperimentWithLocalDate } from "@/lib/controllers/types";

export const useMutationToUpdateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();
    return useMutation({
        mutationFn: updateAssayResult,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Succesfully updated assay result");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};

export const useMutationToUpdateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

    return useMutation({
        mutationFn: updateAssay,
        onSuccess: (updatedAssay: Assay) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert(
                "success",
                `Succesfully updated assay ${assayTypeIdToName(
                    updatedAssay.type
                )}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};

export const useMutationToUpdateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

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
    });
};

export const useMutationToUpdateExperiment = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

    return useMutation({
        mutationFn: updateExperiment,
        onSuccess: (updatedExperiment: ExperimentWithLocalDate) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert(
                "success",
                `Succesfully updated experiment ${updatedExperiment.id}`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};

export const useMutationToSetConditionAsControl = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

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
    });
};
