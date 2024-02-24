import assayTypesJSON from "@/data/assayTypes.json";
import { ApiError } from "next/dist/server/api-utils";

export const getDistinctAssayTypes = (): string[] => {
    return assayTypesJSON.assay_types.map((assayType) => assayType.name);
};

export const assayTypeNameToId = (name: string): number => {
    const assayType = assayTypesJSON.assay_types.find(
        (assayType) => assayType.name === name
    );
    if (assayType) {
        return assayType.id;
    }
    throw new ApiError(400, `Assay type ${name} is not recognized`);
};

export const assayTypeIdToName = (id: number): string => {
    const assayType = assayTypesJSON.assay_types.find(
        (assayType) => assayType.id === id
    );
    if (assayType) {
        return assayType.name;
    }
    throw new ApiError(400, `Assay type with ID ${id} is not found`);
};

export const getAssayTypeUnits = (identifier: string | number): string => {
    const assayType = assayTypesJSON.assay_types.find(
        (assayType) =>
            assayType.name === identifier || assayType.id === identifier
    );
    if (assayType) {
        return assayType.units;
    }
    throw new ApiError(400, `Assay type ${identifier} is not recognized`);
}
