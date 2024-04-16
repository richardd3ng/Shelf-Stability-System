import { Experiment } from "@prisma/client";
import { ExperimentWithLocalDate } from "./types";
import { LocalDate, ZoneId, nativeJs } from "@js-joda/core";

export type ExperimentJSON = Omit<Experiment, "startDate"> & {
    startDate: string;
};

export const JSONToExperiment = (JSONData: ExperimentJSON): ExperimentWithLocalDate => stringFieldsToLocalDate(JSONData, ["startDate"]);

// Convert all string fields listed in K to LocalDate
// Fairly simple ultimately, but made complex for the sake of type safety
export function stringFieldsToLocalDate<T extends { [P in K]: string }, K extends string | number | symbol>(obj: T, fields: K[]): T & { [P in K]: LocalDate } {
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

export function dateFieldsToLocalDate<T extends { [P in K]: Date }, K extends string | number | symbol>(obj: T, fields: K[]): T & { [P in K]: LocalDate } {
    const replacements: Partial<{ [P in K]: LocalDate }> = {};

    // Convert all string fields listed in K to LocalDate
    for (const key of fields) {
        if (obj[key] instanceof Date) {
            replacements[key] = LocalDate.from(nativeJs(obj[key], ZoneId.UTC));
        } else {
            throw new Error(`Field ${String(key)} is not a date`);
        }
    }
    return {
        ...obj,
        ...(replacements as { [P in K]: LocalDate })
    };
}
