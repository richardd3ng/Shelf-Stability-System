import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
    fetchExperimentInfo,
    fetchExperimentOwner,
} from "@/lib/controllers/experimentController";
import { ExperimentInfo, ExperimentOwner } from "@/lib/controllers/types";

export const useExperimentInfo = (
    experimentId: number
): UseQueryResult<ExperimentInfo> => {
    return useQuery<ExperimentInfo>({
        queryKey: getQueryKeyForUseExperimentInfo(experimentId),
        queryFn: () => fetchExperimentInfo(experimentId),
        refetchOnWindowFocus: false,
    });
};

export const useExperimentOwner = (
    experimentId: number
): UseQueryResult<ExperimentOwner> => {
    return useQuery<ExperimentOwner>({
        queryKey: getQueryKeyForUseExperimentOwner(experimentId),
        queryFn: () => fetchExperimentOwner(experimentId),
    });
};
export const getQueryKeyForUseExperimentInfo = (experimentId: number) => {
    return ["fetch experiment info", experimentId];
};

export const getQueryKeyForUseExperimentOwner = (experimentId: number) => {
    return ["fetch experiment owner", experimentId];
};

export const getDeepCopyOfExperimentInfo = (
    info: ExperimentInfo
): ExperimentInfo => {
    return structuredClone(info);
};
