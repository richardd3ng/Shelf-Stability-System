import { Experiment, Condition, Assay, AssayType } from "@prisma/client"

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