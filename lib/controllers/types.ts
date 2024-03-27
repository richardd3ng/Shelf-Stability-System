import { LocalDate } from "@js-joda/core";
import {
    Experiment,
    Condition,
    Assay,
    AssayResult,
    User,
    AssayType,
    AssayTypeForExperiment,
} from "@prisma/client";

/* ----- Experiment ----- */

export type ExperimentWithLocalDate = Omit<Experiment, 'startDate'> & {
    startDate: LocalDate;
};

export type ExperimentInfo = {
    experiment: ExperimentWithLocalDate;
    conditions: Condition[];
    assays: Assay[];
    assayResults: AssayResult[];
    assayTypes: AssayTypeInfo[];
};

export type ExperimentOwner = {
    username: string;
};

export type ExperimentTableInfo = {
    id: number;
    title: string;
    startDate: LocalDate;
    week: number;
    isCanceled: boolean;
    owner: string;
    ownerId: number;
};

export type ExperimentTable = {
    // Rows on this page
    rows: ExperimentTableInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type ExperimentCreationRequiringConditionAndAssayTypeArgs = Omit<
    ExperimentWithLocalDate,
    "id"
> & {
    conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[];
    assayTypeForExperimentCreationArgsArray : Omit<Omit<AssayTypeForExperiment, "id">, "experimentId">[];
};

export type ExperimentCreationArgs =
    | Omit<ExperimentWithLocalDate, "id">
    | {
        conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[];
    };
export type ExperimentCreationResponse = Omit<
    ExperimentInfo,
    "assays" | "assayResults" | "assayTypes"
>;

// experiment updates are done in a single atomic transaction
export type ExperimentUpdateArgs = {
    id: number;
    title?: string;
    description?: string | null;
    startDate?: LocalDate;
    isCanceled?: boolean;
};

export type ExperimentStatus = "all" | "cancelled" | "non-cancelled";

/* ----- Assay ----- */

export type AssayAgendaInfo = {
    id: number;
    targetDate: LocalDate;
    title: string;
    experimentId: number;
    owner: string;
    condition: string;
    week: number;
    type: string;
    resultId: number | null;
};

export type AssayAgendaTable = {
    // Rows on this page
    rows: AssayAgendaInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type AssayCreationArgs = Omit<Assay, "id">;

// experiment updates can be done by individual fields
export type AssayUpdateArgs = {
    id: number;
    conditionId?: number;
    assayTypeId?: number;
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

/* ----- Assay Type ------ */
export type AssayTypeInfo = AssayTypeForExperiment & {
    assayType: AssayType;
};

export type UpdateAssayTypeArgs = {
    assayTypeId : number;
    newName : string | null;
    newUnits : string | null;
}

export type AssayTypeCreationArgs = Omit<AssayType, "id">;

export type UpdateTechnicianArgs = {
    assayTypeForExperimentId : number;
    technicianId : number;
}

/* ----- Assay Result ----- */

export type AssayResultCreationArgs = Omit<AssayResult, "id">;

// assay result updates can be done by individual fields
export type AssayResultUpdateArgs = {
    id: number;
    result?: number | null;
    comment?: string | null;
    author: string;
};

/* ----- User ----- */

export type UserInfo = {
    id: number;
    username: string;
    displayName: string;
    email: string | null;
    isSSO: boolean;
    isAdmin: boolean;
};

export type UserTable = {
    // Rows on this page
    rows: UserInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type UserWithoutPassword = Omit<User, "password">;

/* ----- Email ----- */

export type EmailQueryResult = {
    userId: number;
    email: string;
    targetDate: string;
    experimentId: number;
    title: string;
    owner: string;
    condition: string;
    week: number;
    assayType: string;
    technician: string;
};

export type EmailInfo = {
    [userId: number]: {
        email: string;
        agenda: {
            targetDate: LocalDate;
            experimentId: number;
            title: string;
            owner: string;
            condition: string;
            week: number;
            assayType: string;
            technician: string;
        }[];
    };
};
