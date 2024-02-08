import fs from "fs";
import {
    AssayCreationArgs,
    AssayTypeCreationArgsNoExperimentId,
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationArgs,
    ExperimentCreationResponse,
} from "../lib/controllers/types";
import { JSONToExperiment } from "../lib/controllers/jsonConversions";
import { ApiError } from "next/dist/server/api-utils";
import { AssayType, Condition } from "@prisma/client";
import dayjs from "dayjs";

interface AssayScheduleImportJSON {
    [condition: string]: {
        [week: number]: string[];
    };
}

interface AssayResultImportJSON {
    condition: string;
    week: number;
    assay_type: string;
    result: string;
}

interface ExperimentImportJSON {
    title: string;
    number: number;
    description: string;
    start_date: string;
    storage_conditions: string[];
    assay_types: string[];
    assay_schedule: AssayScheduleImportJSON;
    assay_results: AssayResultImportJSON[];
}

const readFileToJSON = (filePath: string): Promise<ExperimentImportJSON[]> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                resolve(JSON.parse(data)["experiments"]);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
};

const getCSRFToken = async (): Promise<string> => {
    const endpoint = "http://localhost:3000/api/auth/csrf";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson.csrfToken;
    } else {
        throw new Error("Failed to fetch CSRF token.");
    }
};

const signInAndCaptureCookie = async (csrfToken: string): Promise<string> => {
    const endpoint = "http://localhost:3000/api/auth/callback/credentials";
    const formData = new FormData();
    formData.append("password", "password");
    formData.append("redirect", "false");
    formData.append("csrfToken", csrfToken);
    formData.append("callbackUrl", "http://localhost:3000/login");
    formData.append("json", "true");

    const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    console.log("response, response.headers:", response, response.headers);
    if (response.ok) {
        return response.headers.getSetCookie()[0];
    } else {
        throw new Error("Failed to sign in.");
    }
};

const postExperiment = async (
    experimentData: ExperimentCreationArgs,
    cookie?: string
): Promise<ExperimentCreationResponse> => {
    const endpoint = "http://localhost:3000/api/experiments/create";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookie || "",
        },
        body: JSON.stringify(experimentData),
    });
    const resJson = await response.json();
    if (response.ok) {
        return {
            experiment: JSONToExperiment(resJson.experiment),
            conditions: resJson.conditions,
            assayTypes: resJson.assayTypes,
        };
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

const postAssays = async (assays: AssayCreationArgs[]) => {
    const endpoint = "http://localhost:3000/api/assays/createMany";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ assays: assays }),
    });
    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        throw new ApiError(response.status, resJson.message);
    }
};

const importExperiments = async (filePath: string) => {
    try {
        const jsonData: ExperimentImportJSON[] = await readFileToJSON(filePath);
        const assayCreationArgsArray: AssayCreationArgs[] = [];
        const experimentPromises = jsonData.map(
            async (experimentImportJSON: ExperimentImportJSON) => {
                const assayTypeCreationArgsNoExperimentIdArray: AssayTypeCreationArgsNoExperimentId[] =
                    experimentImportJSON.assay_types.map(
                        (assayType: string) => {
                            return {
                                name: assayType,
                            };
                        }
                    );
                const conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[] =
                    experimentImportJSON.storage_conditions.map(
                        (condition: string, index: number) => {
                            return {
                                name: condition,
                                control: index === 0,
                            };
                        }
                    );
                const experimentData: ExperimentCreationArgs = {
                    title: experimentImportJSON.title,
                    description: experimentImportJSON.description,
                    start_date: new Date(
                        experimentImportJSON.start_date
                    ).toISOString(),
                    assayTypeCreationArgsNoExperimentIdArray:
                        assayTypeCreationArgsNoExperimentIdArray,
                    conditionCreationArgsNoExperimentIdArray:
                        conditionCreationArgsNoExperimentIdArray,
                };
                const experimentResJson = await postExperiment(
                    experimentData
                    // cookie
                );
                const createdAssayTypes: AssayType[] =
                    experimentResJson.assayTypes;
                const createdConditions: Condition[] =
                    experimentResJson.conditions;
                const assayTypeToId = new Map<string, number>(
                    createdAssayTypes.map((type) => [type.name, type.id])
                );
                const conditionToId = new Map<string, number>(
                    createdConditions.map((condition) => [
                        condition.name,
                        condition.id,
                    ])
                );
                for (const condition in experimentImportJSON.assay_schedule) {
                    const schedule =
                        experimentImportJSON.assay_schedule[condition];
                    for (const week in schedule) {
                        for (const assayType of schedule[week]) {
                            if (!assayTypeToId.has(assayType)) {
                                throw new Error(
                                    `Bad JSON data: Assay type ${assayType} not found in database`
                                );
                            }
                            if (!conditionToId.has(condition)) {
                                throw new Error(
                                    `Bad JSON data: Condition ${condition} not found in database`
                                );
                            }
                            assayCreationArgsArray.push({
                                experimentId: experimentResJson.experiment.id,
                                typeId: Number(assayTypeToId.get(assayType)),
                                conditionId: Number(
                                    conditionToId.get(condition)
                                ),
                                target_date: dayjs(
                                    experimentImportJSON.start_date
                                )
                                    .add(parseInt(week), "weeks")
                                    .toDate(),
                                result: null,
                            });
                            for (const assayResult of experimentImportJSON.assay_results) {
                                if (
                                    assayResult.condition === condition &&
                                    assayResult.week === parseInt(week) &&
                                    assayResult.assay_type === assayType
                                ) {
                                    assayCreationArgsArray[
                                        assayCreationArgsArray.length - 1
                                    ].result = assayResult.result;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        );
        await Promise.all(experimentPromises);
        console.log(
            "Sucessfully created experiments, assay types, and conditions!"
        );
        await postAssays(assayCreationArgsArray);
        console.log("Successfully created assays!");
    } catch (error) {
        console.error("Error importing experiments:", error);
    }
};

if (process.argv.length !== 3) {
    console.error("Usage: ts-node import-experiments <file-path>");
    process.exit(1);
}
const filePath = process.argv[2];
importExperiments(filePath);
