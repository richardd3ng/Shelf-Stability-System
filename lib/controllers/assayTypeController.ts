import { ApiError } from "next/dist/server/api-utils";
import {
    AssayTypeInfo,
    CustomAssayTypeForExperimentCreationArgs,
    ExperimentInfo,
    StandardAssayTypeForExperimentCreationsArgs,
    UpdateAssayTypeArgs,
    UpdateTechnicianArgs,
} from "./types";
import { AssayType, AssayTypeForExperiment } from "@prisma/client";

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

export const createNewCustomAssayTypeForExperimentThroughAPI = async (
    creationArgs: CustomAssayTypeForExperimentCreationArgs
): Promise<AssayTypeInfo> => {
    const endpoint = "/api/assayTypeForExperiment/createCustom";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...creationArgs }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return { ...resJson };
    }
    throw new ApiError(response.status, resJson.message);
};

export const getAllStandardAssayTypesThroughAPI = async (): Promise<
    AssayType[]
> => {
    const endpoint = "/api/assayTypeForExperiment/getAllStandardAssayTypes";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return [...resJson];
    }
    throw new ApiError(response.status, resJson.message);
};

const getUpdateAssayTypeBody = (updateArgs: UpdateAssayTypeArgs) => {
    if (updateArgs.name && updateArgs.units) {
        return {
            name: updateArgs.name,
            units: updateArgs.units,
        };
    } else if (updateArgs.name) {
        return {
            name: updateArgs.name,
        };
    } else if (updateArgs.units) {
        return {
            units: updateArgs.units,
        };
    } else {
        return {};
    }
};

export const updateAssayTypeThroughAPI = async (
    updateArgs: UpdateAssayTypeArgs
): Promise<AssayType> => {
    const endpoint = "/api/assayType/" + updateArgs.assayTypeId.toString();

    const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateArgs),
    });
    const resJson = await response.json();
    if (response.ok) {
        return { ...resJson };
    }
    throw new ApiError(response.status, resJson.message);
};

export const updateTechnicianOfAssayTypeForExperimentThroughAPI = async (
    updateArgs: UpdateTechnicianArgs
): Promise<AssayTypeForExperiment> => {
    const endpoint =
        "/api/assayTypeForExperiment/" +
        updateArgs.assayTypeForExperimentId.toString();

    const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ technicianId: updateArgs.technicianId }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return { ...resJson };
    }
    throw new ApiError(response.status, resJson.message);
};

export const deleteAssayTypeForExperimentThroughAPI = async (
    assayTypeForExperimentId: number
): Promise<AssayTypeForExperiment> => {
    const endpoint =
        "/api/assayTypeForExperiment/" + assayTypeForExperimentId.toString();

    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return { ...resJson };
    }
    throw new ApiError(response.status, resJson.message);
};

export const checkIfThereAreRecordedResultsForAssayType = (
    assayTypeForExperimentId: number,
    experimentInfo: ExperimentInfo
): boolean => {
    let hasResults: boolean = false;
    experimentInfo.assays.forEach((assay) => {
        if (assay.assayTypeId === assayTypeForExperimentId) {
            experimentInfo.assayResults.forEach((result) => {
                if (
                    result.assayId === assay.id &&
                    (result.result || result.comment)
                ) {
                    hasResults = true;
                }
            });
        }
    });
    return hasResults;
};
