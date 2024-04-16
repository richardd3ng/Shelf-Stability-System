import { ExperimentImportJSON, readExperimentsFileToJSON } from "./jsonParser";
import { Condition, } from "@prisma/client";


const importExperiments = async (filePath: string) => {
    try {
        const jsonData: ExperimentImportJSON[] = await readExperimentsFileToJSON(filePath);

        for (const experiment of jsonData) {
            parseAndCreateAssaysForExperimentInDB(experiment);
        }

        console.log("Successfully imported data!");
    } catch (error) {
        console.error("Error importing experiments:", error);
    }
};



function parseAndCreateAssaysForExperimentInDB(experiment: ExperimentImportJSON) {
    for (const condition in experiment.assay_schedule) {
        const schedule = experiment.assay_schedule[condition];
        for (const week in schedule) {
                let typeChecker = new Set<string>();
            for (const assayTypeAndSampleNum of schedule[week]) {
                if (typeChecker.has(assayTypeAndSampleNum.assay_type)){
                    console.log("duplicate type " + assayTypeAndSampleNum.assay_type + " at " + week + ", " + condition + ", " + experiment.number);
                }
                typeChecker.add(assayTypeAndSampleNum.assay_type);

            }
        }
    }
}


if (process.argv.length !== 3) {
    console.error("Usage: ts-node import-experiments <file-path>");
    process.exit(1);
}

const filePath = process.argv[2];
importExperiments(filePath);
