import { Experiment, Condition, Assay, AssayType } from "@prisma/client";

export type ExperimentInfo = {
    experiment: Experiment;
    conditions: Condition[];
    assays: Assay[];
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

export type UserInfo = {
    username: string;
    isAdmin: boolean;
};

export type UserTable = {
    // Rows on this page
    rows: UserInfo[];
    // Rows in the whole table
    rowCount: number;
};

export type AssayCreationArgs = Omit<Assay, "id">;
export type ConditionCreationArgs = Omit<Condition, "id">;

export type ConditionCreationArgsNoExperimentId = Omit<
    ConditionCreationArgs,
    "experimentId"
>;
export type ExperimentCreationArgs =
    | {
          title: string;
          description: string;
          start_date: string;
      }
    | {
          conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[];
      };

export type ExperimentCreationResponse = Omit<ExperimentInfo, "assays">;

export type ConditionNamesResponse = {
    name: string;
};
