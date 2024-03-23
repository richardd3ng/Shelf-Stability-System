// TODO: update this

// import { CreatedExperimentIdAndConditions, createExperimentWithConditions } from "../../lib/api/dbOperations/experimentOperations";
// import { ExperimentImportJSON, readExperimentsFileToJSON } from "./jsonParser";
// import { AssayCreationArgs, AssayResultCreationArgs, ExperimentCreationArgs, ConditionCreationArgsNoExperimentId, ExperimentCreationRequiringConditionArgs } from "../../lib/controllers/types";
// import { LocalDate, DateTimeFormatter } from "@js-joda/core";
// import { getAllUsers } from "../../lib/api/dbOperations/userOperations";
// import { User, Condition, Assay } from "@prisma/client";
// import { createAssays, getAssaysForExperiment } from "../../lib/api/dbOperations/assayOperations";
// import { assayTypeNameToId } from "../../lib/controllers/assayTypeController";
// import { createAssayResults } from "../../lib/api/dbOperations/assayResultOperations";

// const getUserIdFromUsername = (username : string, allUsers : User[]) : number => {
//     const user = allUsers.find((u) => u.username === username);
//     if (user){
//         return user.id;
//     } else {
//         throw new Error("User " + username + " does not exist");
//     }

// }

// const importExperiments = async (filePath: string) => {
//     try {
//         const allUsers = await getAllUsers();
//         const jsonData: ExperimentImportJSON[] = await readExperimentsFileToJSON(filePath);

//         for (const experiment of jsonData) {
//             const createdExperiment = await parseAndCreateExperimentWithConditionsInDB(experiment, allUsers);
//             const conditionToId = getConditionToIdMap(createdExperiment.conditions);
//             await parseAndCreateAssaysForExperimentInDB(experiment, conditionToId, createdExperiment);
//             await parseAndCreateAssayResultsForExperimentInDB(createdExperiment, experiment, conditionToId);
//         }

//         console.log("Successfully imported data!");
//     } catch (error) {
//         console.error("Error importing experiments:", error);
//     }
// };

// const getConditionToIdMap = (conditions : Condition[]) : Map<string, number> => {
//     return new Map<string, number>(
//         conditions.map((condition) => [
//             condition.name,
//             condition.id,
//         ])
//     );
// }
// const getConditionIdFromName = (conditionToId : Map<string, number>, conditionName : string) : number => {
//     const conditionId = conditionToId.get(conditionName);
//     if (conditionId){
//         return conditionId;
//     } else {
//         throw new Error("Condition name has no corresponding database entry")
//     }
// }

// const getCorrespondingAssayId = (createdAssays : Assay[], week : number, conditionId : number, type : number ) : number =>{
//     const assay = createdAssays.find((a) => (a.conditionId === conditionId && a.week === week && a.type === type ));
//     if (assay){
//         return assay.id;
//     } else {
//         throw new Error("Assay result has no corresponding assay!");
//     }
// }

// async function parseAndCreateAssayResultsForExperimentInDB(createdExperiment: CreatedExperimentIdAndConditions, experiment: ExperimentImportJSON, conditionToId: Map<string, number>) {
//     const createdAssays = await getAssaysForExperiment(createdExperiment.id);
//     let assayResults: AssayResultCreationArgs[] = [];
//     experiment.assay_results.forEach((result) => {
//         const conditionId = getConditionIdFromName(conditionToId, result.condition);
//         const type = assayTypeNameToId(result.assay_type);
//         const correspondingAssayId = getCorrespondingAssayId(createdAssays, result.week, conditionId, type);
//         assayResults.push({
//             assayId: correspondingAssayId,
//             result: result.result.value,
//             comment: result.result.comment,
//             author: result.result.author ? result.result.author : ""
//         });

//     });
//     createAssayResults(assayResults);
// }

// async function parseAndCreateAssaysForExperimentInDB(experiment: ExperimentImportJSON, conditionToId: Map<string, number>, createdExperiment: CreatedExperimentIdAndConditions) {
//     const assayCreationArgsArray: AssayCreationArgs[] = [];
//     for (const condition in experiment.assay_schedule) {
//         const schedule = experiment.assay_schedule[condition];
//         for (const week in schedule) {
//             for (const assayType of schedule[week]) {

//                 if (!conditionToId.has(condition)) {
//                     throw new Error(
//                         `Bad JSON data: Condition ${condition} not found in database`
//                     );
//                 }
//                 assayCreationArgsArray.push({
//                     experimentId: createdExperiment.id,
//                     type: assayTypeNameToId(assayType),
//                     conditionId: getConditionIdFromName(conditionToId, condition),
//                     week: parseInt(week),
//                 });

//             }
//         }
//     }
//     await createAssays(assayCreationArgsArray);
// }

// async function parseAndCreateExperimentWithConditionsInDB(experiment: ExperimentImportJSON, allUsers: User[]) {
//     const conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[] = experiment.storage_conditions.map(
//         (condition: string, index: number) => {
//             return {
//                 name: condition,
//                 isControl: index === 0,
//             };
//         }
//     );
//     const experimentData: ExperimentCreationRequiringConditionArgs = {
//         title: experiment.title,
//         description: experiment.description,
//         startDate: LocalDate.parse(experiment.startDate, DateTimeFormatter.ISO_LOCAL_DATE),
//         ownerId: getUserIdFromUsername(experiment.owner, allUsers),
//         conditionCreationArgsNoExperimentIdArray: conditionCreationArgsNoExperimentIdArray,
//         isCanceled : false
//     };
//     const createdExperiment = await createExperimentWithConditions(experimentData);
//     return createdExperiment;
// }

// if (process.argv.length !== 3) {
//     console.error("Usage: ts-node import-experiments <file-path>");
//     process.exit(1);
// }

// const filePath = process.argv[2];
// importExperiments(filePath);
