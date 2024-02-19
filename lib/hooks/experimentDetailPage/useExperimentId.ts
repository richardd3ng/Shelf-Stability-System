import { useRouter } from "next/router";
import { INVALID_EXPERIMENT_ID } from "@/lib/api/apiHelpers";
export const useExperimentId = (): number => {
    const router = useRouter();
    const experimentId = router.query.experimentId
        ? Number(router.query.experimentId.toString())
        : INVALID_EXPERIMENT_ID;
    return experimentId;
};
