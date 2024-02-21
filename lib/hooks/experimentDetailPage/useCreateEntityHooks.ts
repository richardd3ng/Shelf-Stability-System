import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { createAssay } from "@/lib/controllers/assayController";
import { createAssayResult } from "@/lib/controllers/assayResultController";
import { createCondition } from "@/lib/controllers/conditionController";
import { useAlert } from "@/lib/context/alert-context";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { Assay, Condition } from "@prisma/client";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";

export const useMutationToCreateCondition = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

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
    });
};

export const useMutationToCreateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

    return useMutation({
        mutationFn: createAssay,
        onSuccess: (createdAssay: Assay) => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert(
                "success",
                `Succesfully created ${assayTypeIdToName(
                    createdAssay.type
                )} assay`
            );
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};

export const useMutationToCreateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

    return useMutation({
        mutationFn: createAssayResult,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Succesfully recorded assay result");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};
