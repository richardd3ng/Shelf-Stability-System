import { ExperimentInfo } from "@/lib/controllers/types";
import { Assay } from "@prisma/client";

export const checkIfAnAssayHasResults = (experimentInfo: ExperimentInfo | undefined, extraFilter : (assay : Assay) => boolean): boolean => {
    if (experimentInfo && experimentInfo.assays) {
        let anAssayHasResults = false;
        experimentInfo.assays.forEach((assay) => {
            if (assay.result && extraFilter(assay)) {
                anAssayHasResults = true;
            }
        });
        return anAssayHasResults;
    } else {
        return false;
    }
};
