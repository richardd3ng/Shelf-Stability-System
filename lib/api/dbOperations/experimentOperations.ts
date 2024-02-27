import { ExperimentCreationArgs } from "../../controllers/types";
import {db} from "../db";
import { localDateToJsDate } from "../../datesUtils";
import { Condition } from "@prisma/client";

export interface CreatedExperimentIdAndConditions {
    id : number;
    conditions : Condition[]
}
export const createExperimentWithConditions = async (experiment : ExperimentCreationArgs) : Promise<CreatedExperimentIdAndConditions> =>  {
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
                start_date : localDateToJsDate(experiment.start_date),
                conditions : {
                    create : experiment.conditionCreationArgsNoExperimentIdArray.map((condition) => {
                        return {
                            name : condition.name,
                            control : condition.control
                        }
                    })
                }   
            }
        
    });
    return createdExperiment;
 

}