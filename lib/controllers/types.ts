import { Experiment, Condition, Assay, AssayType } from "@prisma/client";
import { ExperimentJSON } from "./jsonConversions";

export type ExperimentInfo = {
    experiment: Experiment;
    conditions: Condition[];
    assayTypes: AssayType[];
    assays: Assay[];
};

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

export type AssayCreationArgs = Omit<Assay, "id">;
export type AssayTypeCreationArgs = Omit<AssayType, "id">;
export type ConditionCreationArgs = Omit<Condition, "id">;
export type ExperimentCreationArgs = Omit<ExperimentJSON, "id">;

export type AssayTypeNamesResponse = {
    name: string;
};
export type ConditionNamesResponse = {
    name: string;
};