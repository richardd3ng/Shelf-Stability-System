import assayTypesJSON from "@/data/assayTypes.json";

export const fetchDistinctAssayTypes = (): string[] => {
    return assayTypesJSON.assay_types.map((assayType) => assayType.name);
};
