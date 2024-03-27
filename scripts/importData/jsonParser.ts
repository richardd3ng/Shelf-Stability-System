import fs from "fs";

export interface AssayScheduleImportJSON {
    [condition: string]: {
        [week: number]: string[];
    };
}

export interface AssignedTechniciansImportJSON {
    [assayType: string]: string;
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
    start_date: string;
    canceled : boolean;
    storage_conditions: string[];
    assay_types: string[];
    assay_schedule: AssayScheduleImportJSON;
    assay_results: AssayResultImportJSON[];
    assigned_technicians : AssignedTechniciansImportJSON;
}

export interface UserImportJSON {
    username : string;
    password : string;
    administrator_permission : boolean;
    display_name : string;
    authentication_type : string;
    email_address : string;
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

