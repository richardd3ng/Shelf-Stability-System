import { ExperimentCreationRequiringConditionArgs } from "../../controllers/types";
import {db} from "../db";
import { localDateToJsDate } from "../../datesUtils";
import { Condition } from "@prisma/client";

export interface CreatedExperimentIdAndConditions {
    id : number;
    conditions : Condition[]
}
export const createExperimentWithConditions = async (experiment : ExperimentCreationRequiringConditionArgs) : Promise<CreatedExperimentIdAndConditions> =>  {
    const createdExperiment = await db.experiment.create({
        select : {
            id : true,
            conditions : true
        },
        data : 
            {
                title : experiment.title,
                ownerId : experiment.ownerId,
                description : experiment.description,
                startDate : localDateToJsDate(experiment.startDate),
                conditions : {
                    create : experiment.conditionCreationArgsNoExperimentIdArray.map((condition) => {
                        return {
                            name : condition.name,
                            control : condition.isControl
                        }
                    })
                }   
            }
        
    });
    return createdExperiment;
 

}