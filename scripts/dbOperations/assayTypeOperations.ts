import { AssayTypeCreationArgs } from "../../lib/controllers/types";
import { Assay, AssayType } from "@prisma/client";
import {db} from "../../lib/api/db";
import { readFileToJSON } from "../importData/jsonParser";

export type AssayTypeNameAndId = {
    name : string;
    id : number;
}

export const createAssayTypes = async (assayTypes : AssayTypeCreationArgs[]) : Promise<AssayTypeNameAndId[]> => {

    let promises : Promise<AssayTypeNameAndId>[] = assayTypes.map((type) => db.assayType.create({data : type, select : {name : true, id : true}}))
    let createdAssayTypes = await Promise.all(promises);
    return createdAssayTypes;
    
}

export interface BasicTypeInfo {
    name : string;
    units : string;
    abbrev : string;
}
export const createBasicAssayTypesIfNeeded = async () : Promise<AssayTypeNameAndId[]> => {
    const basicTypes : BasicTypeInfo[] = await readFileToJSON("../../data/assayTypes.json", "assay_types");

    const assayTypes = await db.assayType.findMany({
        where : {
            name : {
                in : basicTypes.map((type) => type.name)
            }
        }
    })

    if (assayTypes.length < basicTypes.length){
        
        let missingTypes = basicTypes.filter((type) => !assayTypes.map((t) => t.name).includes(type.name));

        await createAssayTypes(missingTypes.map((t) => ({
            name : t.name,
            units : t.units,
            description : t.abbrev,
            isCustom : false
        })))
    }
    return await db.assayType.findMany({
        select : {
            name : true,
            id : true
        },
        where : {
            name : {
                in : basicTypes.map((type) => type.name)
            }

        }
    })
}

export const getAssaysForExperiment = async (experimentId : number) : Promise<Assay[]> => {
    const assays = await db.assay.findMany({
        where : {
            experimentId : experimentId
        }
    })
    return assays;
}


