import { AssayCreationArgs } from "../../lib/controllers/types";
import { Assay } from "@prisma/client";
import {db} from "../../lib/api/db";

export const createAssays = async (assays : AssayCreationArgs[]) => {
    await db.assay.createMany({
        data : assays.map((assay) => {
            return {
                conditionId : assay.conditionId,
                experimentId : assay.experimentId,
                assayTypeId : assay.assayTypeId,
                week : assay.week,
                
            };
        })
            
    });
    

}

export const getAssaysForExperiment = async (experimentId : number) : Promise<Assay[]> => {
    const assays = await db.assay.findMany({
        where : {
            experimentId : experimentId
        }
    })
    return assays;
}


