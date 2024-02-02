import { Experiment, Condition, Assay, AssayType } from "@prisma/client";
import { ExperimentJSON } from "./jsonConversions";

export type ExperimentInfo = {
    experiment : Experiment;
    conditions : Condition[];
    assayTypes : AssayType[];
    assays : Assay[];
}

export type AssayInfo = {
    id: number;
    targetDate: Date;
    title: string;
    condition: string;
    week: number;
    type: string;
    result: string | null;
}

export type AssayTable = {
    // Rows on this page
    rows: AssayInfo[];
    // Rows in the whole table
    rowCount: number;
}

export type ExperimentList = {
    experiments: Experiment[];
};

// export type ExperimentAssayTypes = {
//     assayTypes: AssayType[];
// };

export type ExperimentCreationData = Omit<ExperimentJSON, "id">;
export type AssayTypeCreationData = Omit<AssayType, "id">;
export type ConditionCreationData = Omit<Condition, "id">;

export type AssayTypeResponse = {
    name: string;
};
export type ConditionResponse = {
    name: string;
};
