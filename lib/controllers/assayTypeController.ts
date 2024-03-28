import { ApiError } from "next/dist/server/api-utils";
import { AssayTypeInfo, StandardAssayTypeForExperimentCreationsArgs, UpdateAssayTypeArgs, UpdateTechnicianArgs } from "./types";
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

export const createNewCustomAssayTypeForExperimentThroughAPI = async (experimentId : number) => {
    const endpoint = "/api/assayTypeForExperiment/createCustom";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({experimentId}),
    });
    const resJson = await response.json();
    if (response.ok) {
        return {...resJson};
    }
    throw new ApiError(response.status, resJson.message);
}

export const createNewStandardAssayTypeForExperimentThroughAPI = async (creationArgs : StandardAssayTypeForExperimentCreationsArgs) => {
    const endpoint = "/api/assayTypeForExperiment/createStandard";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            experimentId : creationArgs.experimentId,
            assayTypeId : creationArgs.assayTypeId
        }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return {...resJson};
    }
    throw new ApiError(response.status, resJson.message);
}

export const getAllStandardAssayTypesThroughAPI = async () : Promise<AssayType[]> => {
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
}


const getUpdateAssayTypeBody = (updateArgs : UpdateAssayTypeArgs) => {
    if (updateArgs.newName && updateArgs.newUnits){
        return {
            name : updateArgs.newName,
            units : updateArgs.newUnits
        };
    } else if (updateArgs.newName){
        return {
            name : updateArgs.newName
        };
    } else if (updateArgs.newUnits){
        return {
            units : updateArgs.newUnits
        };
    } else {
        return {};
    }
}

export const updateAssayTypeThroughAPI = async (updateArgs : UpdateAssayTypeArgs) : Promise<AssayType> => {
    const endpoint = "/api/assayType/" + updateArgs.assayTypeId.toString();

    const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(getUpdateAssayTypeBody(updateArgs)),
    });
    const resJson = await response.json();
    if (response.ok) {
        return {...resJson};
    }
    throw new ApiError(response.status, resJson.message);
}

export const updateTechnicianOfAssayTypeForExperimentThroughAPI = async (updateArgs : UpdateTechnicianArgs) : Promise<AssayTypeForExperiment> => {
    const endpoint = "/api/assayTypeForExperiment/" + updateArgs.assayTypeForExperimentId.toString();

    const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({technicianId : updateArgs.technicianId}),
    });
    const resJson = await response.json();
    if (response.ok) {
        return {...resJson};
    }
    throw new ApiError(response.status, resJson.message);
}

export const deleteAssayTypeForExperimentThroughAPI = async (assayTypeForExperimentId : number) : Promise<AssayTypeForExperiment> => {
    const endpoint = "/api/assayTypeForExperiment/" + assayTypeForExperimentId.toString();

    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return {...resJson};
    }
    throw new ApiError(response.status, resJson.message);
}

