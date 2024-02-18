import { Experiment } from "@prisma/client";

export const JSONToExperiment = (JSONData: Experiment): Experiment => {
    return {
        ...JSONData,
        start_date: new Date(JSONData.start_date),
    };
};
