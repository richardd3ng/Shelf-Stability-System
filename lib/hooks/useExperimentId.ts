import { useRouter } from "next/router";
export const INVALID_EXPERIMENT_ID = -1;
export const useExperimentId = () : number => {
    const router = useRouter();
    const experimentId = router.query.experimentId ? Number(router.query.experimentId.toString()) : INVALID_EXPERIMENT_ID;
    return experimentId;
}