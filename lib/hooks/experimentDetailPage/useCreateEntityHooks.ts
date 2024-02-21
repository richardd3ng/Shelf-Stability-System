import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useExperimentId } from "./useExperimentId";
import { getQueryKeyForUseExperimentInfo } from "./experimentDetailHooks";
import { createAssay } from "@/lib/controllers/assayController";
import { createAssayResult } from "@/lib/controllers/assayResultController";
import { useAlert } from "@/lib/context/alert-context";
import { getErrorMessage } from "@/lib/api/apiHelpers";

// export const useMutationToCreateCondition = () => {
//     const queryClient = useQueryClient();
//     const experimentId = useExperimentId();
//     const { showAlert } = useAlert();

//     return useMutation({
//         mutationFn: createCondition,
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: getQueryKeyForUseExperimentInfo(experimentId),
//             });
//         },
//         onError: (error) => {
//             showAlert("error", getErrorMessage(error));
//         },
//     });
// };

export const useMutationToCreateAssay = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { showAlert } = useAlert();

    return useMutation({
        mutationFn: createAssay,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            showAlert("success", "Succesfully created assay");
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
            showAlert("success", "Succesfully created assay result");
        },
        onError: (error) => {
            showAlert("error", getErrorMessage(error));
        },
    });
};
