import { Assay, Experiment } from "@prisma/client";


export type ExperimentJSON = Omit<Experiment, 'start_date'> & { start_date : string };
export const JSONToExperiment = (JSONData : ExperimentJSON) : Experiment => {
    return {
        ...JSONData,
        start_date : new Date(JSONData.start_date)
    }
}

export type AssayJSON = Omit<Assay, 'target_date'> & { target_date : string };
export const JSONToAssay = (JSONData : AssayJSON) : Assay => {
    return {
        ...JSONData,
        target_date :  new Date(JSONData.target_date)
    }
}