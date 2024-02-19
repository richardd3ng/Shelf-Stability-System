import { Assay, Experiment } from "@prisma/client";
import { ExperimentData } from "./types";
import { LocalDate } from "@js-joda/core";

export type ExperimentJSON = Omit<Experiment, "start_date"> & { start_date: string };

export const JSONToExperiment = (JSONData: ExperimentJSON): ExperimentData => stringFieldsToLocalDate(JSONData, ["start_date"]);

export type AssayJSON = Omit<Assay, "target_date"> & { target_date: string };

export const JSONToAssay = (JSONData: AssayJSON): Assay => stringFieldsToLocalDate(JSONData, ["target_date"]);

// Convert all string fields listed in K to LocalDate
// Fairly simple ultimately, but made complex for the sake of type safety
export function stringFieldsToLocalDate<T extends { [P in K]: string }, K extends string | number | symbol>(obj: T, fields: K[]): Omit<T, K> & { [P in K]: LocalDate } {
    const replacements: Partial<{ [key in K]: LocalDate }> = {};

    // Convert all string fields listed in K to LocalDate
    for (const key of fields) {
        if (typeof obj[key] === "string") {
            replacements[key] = LocalDate.parse(obj[key] as string);
        } else {
            throw new Error(`Field ${String(key)} is not a string`);
        }
    }
    return {
        ...obj,
        ...replacements
    };
}