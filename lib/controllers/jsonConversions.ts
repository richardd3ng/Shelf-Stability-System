import { Experiment } from "@prisma/client";
import { ExperimentWithLocalDate } from "./types";
import { LocalDate } from "@js-joda/core";

export type ExperimentJSON = Omit<Experiment, "start_date"> & {
    start_date: string;
};

export const JSONToExperiment = (
    JSONData: ExperimentJSON
): ExperimentWithLocalDate => {
    return {
        ...JSONData,
        start_date: LocalDate.parse(JSONData.start_date),
    };
};
