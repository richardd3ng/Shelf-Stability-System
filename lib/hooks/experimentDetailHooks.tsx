import {
    useQuery,
    UseQueryResult,
    useMutation,
    useQueryClient,
} from "react-query";
import { fetchExperimentInfo } from "../controllers/experimentController";
import { ExperimentInfo } from "../controllers/types";
import { updateAssayResultThroughAPI } from "../controllers/updateAssayResult";
import { useExperimentId } from "./useExperimentId";

export const useExperimentInfo = (
    experimentId: number
): UseQueryResult<ExperimentInfo> => {
    return useQuery<ExperimentInfo>(
        getQueryKeyForUseExperimentInfo(experimentId),
        () => fetchExperimentInfo(experimentId)
    );
};

export const useMutationToUpdateAssayResult = () => {
    const queryClient = useQueryClient();
    const experimentId = useExperimentId();
    const { data: experimentData } = useExperimentInfo(experimentId);
    return useMutation(updateAssayResultThroughAPI, {
        onSuccess: (newResultInfo) => {
            if (experimentData) {
                let newAssays = [...experimentData.assays];
                let assay = newAssays.findLast(
                    (assay) => assay.id === newResultInfo.assayId
                );
                if (assay) {
                    assay.result = newResultInfo.newResult;
                    let newExperimentData = {
                        ...experimentData,
                        assays: newAssays,
                    };
                    queryClient.setQueryData(
                        getQueryKeyForUseExperimentInfo(experimentId),
                        newExperimentData
                    );
                }
            }
        },
    });
};

const getQueryKeyForUseExperimentInfo = (experimentId: number) => {
    return ["fetch experiment info", experimentId];
};
