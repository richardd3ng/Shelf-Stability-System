import { Experiment, Condition, Assay, AssayResult } from "@prisma/client";

/* ----- Experiment ----- */
export type ExperimentInfo = {
    experiment: Experiment;
    conditions: Condition[];
    assays: Assay[];
    assayResults: AssayResult[];
};

export type ExerimentTableInfo = {
    id: number;
    title: string;
    startDate: Date;
    week: number;
};

export type ExperimentTable = {
    // Rows on this page
    rows: ExerimentTableInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type ExperimentCreationArgs =
    | {
          title: string;
          description: string;
          start_date: string;
          ownerId: number;
      }
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
    startDate?: Date;
    ownerId?: number;
};

export type ExperimentUpdateResponse = ExperimentCreationResponse;

/* ----- Assay ----- */
export type AssayInfo = {
    id: number;
    targetDate: Date;
    title: string;
    experimentId: number;
    condition: string;
    week: number;
    type: string;
    result: string | null;
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
export type AssayResultCreationArgs = Omit<AssayResult, "id">;

export type AssayResultUpdateArgs = {
    id: number;
    result?: number;
    comment?: string;
    last_editor: string;
};
