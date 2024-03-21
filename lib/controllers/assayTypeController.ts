import { ApiError } from "next/dist/server/api-utils";
import { AssayTypeInfo } from "./types";

export const assayTypeIdToName = (
    assayTypeForExperimentId: number,
    assayTypesForExperiment: AssayTypeInfo[]
): string => {
    const correspondingType = getCorrespondingAssayType(
        assayTypeForExperimentId,
        assayTypesForExperiment
    );
    if (correspondingType) {
        return correspondingType.assayType.name;
    } else {
        throw new ApiError(
            400,
            `Assay type with ID ${assayTypeForExperimentId} is not found`
        );
    }
};

export const getAssayTypeUnits = (
    assayTypeForExperimentId: number,
    assayTypesForExperiment: AssayTypeInfo[]
): string => {
    const correspondingType = getCorrespondingAssayType(
        assayTypeForExperimentId,
        assayTypesForExperiment
    );
    if (correspondingType) {
        if (correspondingType.assayType.units) {
            return correspondingType.assayType.units;
        } else {
            return "";
        }
    }
    throw new ApiError(
        400,
        `Assay type ${assayTypeForExperimentId} is not recognized`
    );
};

export const getCorrespondingAssayType = (
    assayTypeForExperimentId: number,
    assayTypesForExperiment: AssayTypeInfo[]
): AssayTypeInfo | undefined => {
    return assayTypesForExperiment.find(
        (type) => type.id === assayTypeForExperimentId
    );
};
