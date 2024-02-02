import { Experiment, Condition, Assay, AssayType } from "@prisma/client";
import { ExperimentJSON } from "./jsonConversions";

export type ExperimentInfo = {
    experiment: Experiment;
    conditions: Condition[];
    assayTypes: AssayType[];
    assays: Assay[];
};

export type ExperimentList = {
    experiments: Experiment[];
};

// export type ExperimentAssayTypes = {
//     assayTypes: AssayType[];
// };

export type ExperimentCreationData = Omit<ExperimentJSON, "id">;
export type AssayTypeCreationData = Omit<AssayType, "id">;
export type ConditionCreationData = Omit<Condition, "id">;
export type ConditionResponse = {
    name: string;
};
