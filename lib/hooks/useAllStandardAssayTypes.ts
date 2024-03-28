import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllStandardAssayTypesThroughAPI } from "../controllers/assayTypeController";
import { AssayType } from "@prisma/client";




export const useAllStandardAssayTypes = (): UseQueryResult<AssayType[]> => {
    return useQuery<AssayType[]>({
        queryKey: ["fetching all standard assay types"],
        queryFn: getAllStandardAssayTypesThroughAPI,
        refetchOnMount : false,
        refetchOnReconnect : false

    });
};

