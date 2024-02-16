import assayTypesJSON from "@/data/assayTypes.json";

export const fetchDistinctAssayTypes = (): string[] => {
    return assayTypesJSON.assay_types.map((assayType) => assayType.name);
};

export const assayTypeNameToId = (name: string): number => {
    const assayType = assayTypesJSON.assay_types.find(
        (assayType) => assayType.name === name
    );
    if (!assayType) {
        throw new Error(`Assay type ${name} is not recognized`);
    }
    return assayType.id;
};

export const assayTypeIdToName = (id: number): string => {
    const assayType = assayTypesJSON.assay_types.find(
        (assayType) => assayType.id === id
    );
    if (!assayType) {
        throw new Error(`Assay type with ID ${id} is not found`);
    }
    return assayType.name;
};
