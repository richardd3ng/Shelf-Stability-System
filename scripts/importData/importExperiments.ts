import { CreatedExperimentIdAndConditionsAndAssayTypes, createExperimentWithConditionsAndAssayTypes } from "../dbOperations/experimentOperations";
import { ExperimentImportJSON, readExperimentsFileToJSON } from "./jsonParser";
import { AssayCreationArgs, AssayResultCreationArgs, ExperimentCreationArgs, ConditionCreationArgsNoExperimentId, ExperimentCreationRequiringConditionAndAssayTypeArgs } from "../../lib/controllers/types";
import { LocalDate, DateTimeFormatter } from "@js-joda/core";
import { getAllUsers } from "../dbOperations/userOperations";
import { User, Condition, Assay, AssayType, AssayTypeForExperiment } from "@prisma/client";
import { createAssays, getAssaysForExperiment } from "../dbOperations/assayOperations";
import { createAssayResults } from "../dbOperations/assayResultOperations";
import { AssayTypeNameAndId, createAssayTypes, createBasicAssayTypesIfNeeded } from "../dbOperations/assayTypeOperations";

const getUserIdFromUsername = (username : string, allUsers : User[]) : number => {
    const user = allUsers.find((u) => u.username === username);
    if (user){
        return user.id;
    } else {
        throw new Error("User " + username + " does not exist");
    }

}

const importExperiments = async (filePath: string) => {
    try {
        const basicAssayTypes : AssayTypeNameAndId[] = await createBasicAssayTypesIfNeeded();
        const allUsers = await getAllUsers();
        const jsonData: ExperimentImportJSON[] = await readExperimentsFileToJSON(filePath);

        for (const experiment of jsonData) {

            const assayTypes = await parseAndCreateAssayTypesIfNeeded(experiment, basicAssayTypes);
            const createdExperiment = await parseAndCreateExperimentWithConditionsAndAssayTypesInDB(experiment, allUsers, assayTypes);
            const conditionToId = getConditionToIdMap(createdExperiment.conditions);
            await parseAndCreateAssaysForExperimentInDB(experiment, conditionToId, createdExperiment);
            await parseAndCreateAssayResultsForExperimentInDB(createdExperiment, experiment, conditionToId);
        }

        console.log("Successfully imported data!");
    } catch (error) {
        console.error("Error importing experiments:", error);
    }
};

const getConditionToIdMap = (conditions : Condition[]) : Map<string, number> => {
    return new Map<string, number>(
        conditions.map((condition) => [
            condition.name,
            condition.id,
        ])
    );
}
const getConditionIdFromName = (conditionToId : Map<string, number>, conditionName : string) : number => {
    const conditionId = conditionToId.get(conditionName);
    if (conditionId){
        return conditionId;
    } else {
        throw new Error("Condition name has no corresponding database entry")
    }
}

const getCorrespondingAssayId = (createdAssays : Assay[], week : number, conditionId : number, type : number ) : number =>{
    const assay = createdAssays.find((a) => (a.conditionId === conditionId && a.week === week && a.assayTypeId === type ));
    if (assay){
        return assay.id;
    } else {
        throw new Error("Assay result has no corresponding assay!");
    }
}

const getCorrespondingAssayTypeId = (assayTypeName : string, experiment : CreatedExperimentIdAndConditionsAndAssayTypes) : number => {
    const type = experiment.assayTypes.find((t) => t.assayType.name === assayTypeName);
    if (type){
        return type.id;
    } else {
        throw new Error("Assay Type " + assayTypeName + " not found!");
    }
}

function getAllAssayTypesFromJSONExperiment(experiment: ExperimentImportJSON) : string[] {
    let extraAssayTypes = new Set<string>();
    experiment.assay_types.forEach((type) => {
        extraAssayTypes.add(type);
    });
    for (const condition in experiment.assay_schedule) {
        const schedule = experiment.assay_schedule[condition];
        for (const week in schedule) {
            for (const assayType of schedule[week]) {

                extraAssayTypes.add(assayType);

            }
        }
    }

    const assayTypes = Array.from(extraAssayTypes);
    return assayTypes;
}

async function parseAndCreateAssayTypesIfNeeded(experiment : ExperimentImportJSON, basicAssayTypes : AssayTypeNameAndId[]){
    const assayTypes = getAllAssayTypesFromJSONExperiment(experiment);
    let customTypes : string[] = assayTypes.filter((typeName) => !basicAssayTypes.map((t) => t.name).includes(typeName));
    const customAssayTypes = await createAssayTypes(customTypes.map((type) => (
        {
            name : type,
            units : null,
            description : null,
            isCustom : true
        }
    )));
    return [...customAssayTypes, ...basicAssayTypes];
}



async function parseAndCreateAssayResultsForExperimentInDB(createdExperiment: CreatedExperimentIdAndConditionsAndAssayTypes, experiment: ExperimentImportJSON, conditionToId: Map<string, number>) {
    const createdAssays = await getAssaysForExperiment(createdExperiment.id);
    let assayResults: AssayResultCreationArgs[] = [];
    experiment.assay_results.forEach((result) => {
        const conditionId = getConditionIdFromName(conditionToId, result.condition);
        const type = getCorrespondingAssayTypeId(result.assay_type, createdExperiment);
        const correspondingAssayId = getCorrespondingAssayId(createdAssays, result.week, conditionId, type);
        assayResults.push({
            assayId: correspondingAssayId,
            result: result.result.value,
            comment: result.result.comment,
            author: result.result.author ? result.result.author : ""
        });

    });
    createAssayResults(assayResults);
}

async function parseAndCreateAssaysForExperimentInDB(experiment: ExperimentImportJSON, conditionToId: Map<string, number>, createdExperiment: CreatedExperimentIdAndConditionsAndAssayTypes) {
    const assayCreationArgsArray: AssayCreationArgs[] = [];
    for (const condition in experiment.assay_schedule) {
        const schedule = experiment.assay_schedule[condition];
        for (const week in schedule) {
            for (const assayType of schedule[week]) {

                if (!conditionToId.has(condition)) {
                    throw new Error(
                        `Bad JSON data: Condition ${condition} not found in database`
                    );
                }
                let assayTypeId = getCorrespondingAssayTypeId(assayType, createdExperiment);
                assayCreationArgsArray.push({
                    experimentId: createdExperiment.id,
                    assayTypeId : assayTypeId,
                    conditionId: getConditionIdFromName(conditionToId, condition),
                    week: parseInt(week),
                });

            }
        }
    }
    await createAssays(assayCreationArgsArray);
}

async function parseAndCreateExperimentWithConditionsAndAssayTypesInDB(experiment: ExperimentImportJSON, allUsers: User[], relevantAssayTypes : AssayTypeNameAndId[]) {
    const conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[] = experiment.storage_conditions.map(
        (condition: string, index: number) => {
            return {
                name: condition,
                isControl: index === 0,
            };
        }
    );
    const assayTypeCreationArgs : Omit<Omit<AssayTypeForExperiment, "id">, "experimentId">[] = getAllAssayTypesFromJSONExperiment(experiment).map((type) => {
        const correspondingAssayType = relevantAssayTypes.find((t) => t.name === type);
        const technicianName : string | undefined = experiment.assigned_technicians[type];
        let technicianId : number | null = null;
        if (technicianName){
            technicianId = getUserIdFromUsername(technicianName, allUsers);
        }
        if (correspondingAssayType){
            return {
                technicianId : technicianId,
                assayTypeId : correspondingAssayType.id
            }
        } else {
            throw new Error("Assay Type " + type + " not found!")
        }
        
    })
    const experimentData: ExperimentCreationRequiringConditionAndAssayTypeArgs = {
        title: experiment.title,
        description: experiment.description,
        startDate: LocalDate.parse(experiment.start_date, DateTimeFormatter.ISO_LOCAL_DATE),
        ownerId: getUserIdFromUsername(experiment.owner, allUsers),
        conditionCreationArgsNoExperimentIdArray: conditionCreationArgsNoExperimentIdArray,
        assayTypeForExperimentCreationArgsArray : assayTypeCreationArgs,
        isCanceled : experiment.canceled
    };
    const createdExperiment = await createExperimentWithConditionsAndAssayTypes(experimentData);
    return createdExperiment;
}

if (process.argv.length !== 3) {
    console.error("Usage: ts-node import-experiments <file-path>");
    process.exit(1);
}

const filePath = process.argv[2];
importExperiments(filePath);
