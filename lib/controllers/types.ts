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

export type ExperimentWithLocalDate = Omit<Experiment, "startDate"> & {
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
    displayName: string;
};

export type ExperimentTableInfo = {
    id: number;
    title: string;
    startDate: LocalDate;
    week: number;
    isCanceled: boolean;
    owner: string;
    ownerDisplayName: string;
    ownerId: number;
    technicianIds: number[];
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
    assayTypeForExperimentCreationArgsArray: Omit<
        Omit<AssayTypeForExperiment, "id">,
        "experimentId"
    >[];
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
    weeks?: string;
};

export type ExperimentStatus = "all" | "cancelled" | "non-cancelled";

/* ----- Assay ----- */

export type AssayAgendaInfo = {
    id: number;
    sample: number;
    targetDate: LocalDate;
    title: string;
    experimentId: number;
    owner: string;
    ownerDisplayName: string;
    technician: string | null;
    technicianDisplayName: string | null;
    technicianTypes: string[] | null;
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

export type AssayWithResult = Assay & {
    result: AssayResult | null;
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
    assayTypeId: number;
    name: string | null;
    units: string | null;
    description: string | null;
};

export type AssayTypeCreationArgs = Omit<AssayType, "id">;

export type CustomAssayTypeForExperimentCreationArgs = Omit<AssayTypeCreationArgs, "isCustom"> & {
    experimentId : number;
    technicianId : number | null;
}

export type StandardAssayTypeForExperimentCreationsArgs = {
    experimentId: number;
    assayTypeId: number;
};

export type UpdateTechnicianArgs = {
    assayTypeForExperimentId: number;
    technicianId: number | null;
};

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
    ownerUsername: string;
    ownerDisplayName: string;
    condition: string;
    week: number;
    assayType: string;
    technicianUsername: string;
    technicianDisplayName: string;
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

/* ----- Lab Utilization ----- */
export type UtilizationReportParams = {
    startDate : LocalDate;
    endDate : LocalDate;
}

export type UtilizationReportRow = {
    weekStartDate : LocalDate;
    count : number;
    assayTypeName : string;
}