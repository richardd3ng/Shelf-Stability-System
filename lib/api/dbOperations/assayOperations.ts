import { AssayCreationArgs } from "../../controllers/types";
import { Assay } from "@prisma/client";
import {db} from "../db";

export const createAssays = async (assays : AssayCreationArgs[]) => {
    await db.assay.createMany({
        data : assays.map((assay) => {
            return {
                conditionId : assay.conditionId,
                experimentId : assay.experimentId,
                type : assay.type,
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


