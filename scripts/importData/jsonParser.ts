import fs from "fs";

export interface AssayScheduleImportJSON {
    [condition: string]: {
        [week: number]: string[];
    };
}

export interface ValueCommentAuthor {
    value : number | null;
    comment : string | null;
    author : string | null;
}

export interface AssayResultImportJSON {
    condition: string;
    week: number;
    assay_type: string;
    result: ValueCommentAuthor;
}

export interface ExperimentImportJSON {
    title: string;
    number: number;
    owner : string;
    description: string;
    startDate: string;
    storage_conditions: string[];
    assay_types: string[];
    assay_schedule: AssayScheduleImportJSON;
    assay_results: AssayResultImportJSON[];
}

export interface UserImportJSON {
    name : string;
    password : string;
    administrator_permission : boolean;
}

export const readUsersFileToJSON = async (filePath : string) : Promise<UserImportJSON[]> => {
    return await readFileToJSON(filePath, "users");
}

export const readExperimentsFileToJSON = async (filePath: string): Promise<ExperimentImportJSON[]> => {
    return await readFileToJSON(filePath, "experiments");
};

export const readFileToJSON = (filePath : string, fieldToLookFor : string) : Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                resolve(JSON.parse(data)[fieldToLookFor]);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

