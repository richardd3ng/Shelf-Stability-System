import { Experiment, Condition, Assay, AssayType } from "@prisma/client"

export type ExperimentInfo = {
    experiment : null | Experiment;
    conditions : null | Condition[];
    assayTypes : null | AssayType[];
    assays : null | Assay[];
}