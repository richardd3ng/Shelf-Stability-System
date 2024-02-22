import { LocalDate } from "@js-joda/core";
import { Experiment, Condition, Assay, AssayResult } from "@prisma/client";

/* ----- Experiment ----- */
export type ExperimentWithLocalDate = Omit<Experiment, "start_date"> & {
    start_date: LocalDate;
};

export type ExperimentInfo = {
    experiment: ExperimentWithLocalDate;
    conditions: Condition[];
    assays: Assay[];
    assayResults: AssayResult[];
};

export type ExperimentOwner = {
    username : string;
}

export type ExperimentTableInfo = {
    id: number;
    title: string;
    startDate: LocalDate;
    week: number;
};

export type ExperimentTable = {
    // Rows on this page
    rows: ExperimentTableInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type ExperimentCreationArgs =
    | Omit<ExperimentWithLocalDate, "id" | "ownerId">
    | {
          conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[];
      };

export type ExperimentCreationResponse = Omit<
    ExperimentInfo,
    "assays" | "assayResults"
>;

export type ExperimentUpdateArgs = {
    id: number;
    title?: string;
    description?: string;
    startDate?: LocalDate;
    ownerId?: number;
};

export type ExperimentUpdateResponse = ExperimentCreationResponse;

/* ----- Assay ----- */
export type AssayInfo = {
    id: number;
    targetDate: Date;
    title: string;
    experimentId: number;
    experimentOwnerId: number;
    condition: string;
    week: number;
    type: string;
    assayResultId: number | null;
    result: number | null;
    comment: string | null;
};

export type AssayTable = {
    // Rows on this page
    rows: AssayInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type AssayCreationArgs = Omit<Assay, "id">;

export type AssayUpdateArgs = {
    id: number;
    conditionId?: number;
    type?: number;
    week?: number;
};

/* ----- Condition ----- */
export type ConditionCreationArgs = Omit<Condition, "id">;

export type ConditionCreationArgsNoExperimentId = Omit<
    ConditionCreationArgs,
    "experimentId"
>;

export type ConditionUpdateArgs = {
    id: number;
    name?: string;
};

/* ----- Assay Result ----- */
export type AssayResultCreationArgs = Omit<AssayResult, "id" | "last_editor">;

export type AssayResultUpdateArgs = {
    id: number;
    result?: number;
    comment?: string;
    // get last edited user from the session token in the backend, see lib/middleware/checkIfLoggedIn.ts
};
