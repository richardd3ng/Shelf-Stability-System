import { LocalDate } from "@js-joda/core";
import { Experiment, Condition, Assay, AssayResult, User } from "@prisma/client";

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
    username: string;
};

export type ExperimentTableInfo = {
    id: number;
    title: string;
    startDate: LocalDate;
    week: number;
    owner: string;
};

export type ExperimentTable = {
    // Rows on this page
    rows: ExperimentTableInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type ExperimentCreationRequiringConditionArgs =
    Omit<ExperimentWithLocalDate, "id">
    & {
          conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[];
      };

export type ExperimentCreationArgs =
| Omit<ExperimentWithLocalDate, "id">
| {
    conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[];
};
export type ExperimentCreationResponse = Omit<
    ExperimentInfo,
    "assays" | "assayResults"
>;

// experiment updates are done in a single atomic transaction
export type ExperimentUpdateArgs = {
    id: number;
    title: string;
    description: string | null;
    startDate?: LocalDate;
    userId: number;
};

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

// experiment updates can be done by individual fields
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

// assay result updates can be done by individual fields
export type AssayResultUpdateArgs = {
    id: number;
    result?: number | null;
    comment?: string | null;
    last_editor: string;
};

/* ----- User ----- */

export type UserInfo = {
    id: number;
    username: string;
    is_admin: boolean;
};

export type UserTable = {
    // Rows on this page
    rows: UserInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type UserWithoutPassword = Omit<User, 'password'>;