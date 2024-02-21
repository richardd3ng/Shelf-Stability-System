import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchExperimentInfo } from "@/lib/controllers/experimentController";
import { ExperimentInfo } from "@/lib/controllers/types";

export const useExperimentInfo = (
    experimentId: number
): UseQueryResult<ExperimentInfo> => {
    return useQuery<ExperimentInfo>({
        queryKey: getQueryKeyForUseExperimentInfo(experimentId),
        queryFn: () => fetchExperimentInfo(experimentId),
    });
};

export const getQueryKeyForUseExperimentInfo = (experimentId: number) => {
    return ["fetch experiment info", experimentId];
};

export const getDeepCopyOfExperimentInfo = (
    info: ExperimentInfo
): ExperimentInfo => {
    return structuredClone(info);
};
