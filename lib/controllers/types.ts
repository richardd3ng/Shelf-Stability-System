import { LocalDate } from "@js-joda/core";
import { Experiment, Condition, Assay, AssayType } from "@prisma/client";

// This isn't a good name, but I don't have a better idea
export type ExperimentData = Omit<Experiment, "start_date"> & { start_date: LocalDate };

export type ExperimentInfo = {
    experiment: ExperimentData;
    conditions: Condition[];
    assays: Assay[];
};

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

export type AssayCreationArgs = Omit<Assay, "id" | "target_date"> & { target_date: LocalDate | null };
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
