import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
    fetchExperimentInfo,
    fetchExperimentOwner,
} from "@/lib/controllers/experimentController";
import { ExperimentInfo, ExperimentOwner } from "@/lib/controllers/types";
import { fetchUserList } from "../controllers/userController";
import { UserInfo } from "@/lib/controllers/types";

const fetchUsersFn = async () : Promise<UserInfo[]> => {
    const users = await fetchUserList("");
    return users.rows;

}


export const useAllUsers = (): UseQueryResult<UserInfo[]> => {
    return useQuery<UserInfo[]>({
        queryKey: ["fetching users"],
        queryFn: fetchUsersFn,

    });
};

