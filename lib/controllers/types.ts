import { Experiment, Condition, Assay, AssayType } from "@prisma/client";

export type ExperimentInfo = {
    experiment: Experiment;
    conditions: Condition[];
    assayTypes: AssayType[];
    assays: Assay[];
};

export type ExperimentList = {
    experiments: Experiment[];
};
