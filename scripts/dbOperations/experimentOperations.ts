import { ExperimentCreationRequiringConditionAndAssayTypeArgs } from "../../lib/controllers/types";
import {db} from "../../lib/api/db";
import { localDateToJsDate } from "../../lib/datesUtils";
import { AssayType, AssayTypeForExperiment, Condition } from "@prisma/client";

export interface CreatedExperimentIdAndConditionsAndAssayTypes {
    id : number;
    conditions : Condition[];
    assayTypes : {
        id : number;
        assayType : AssayType;
    }[];
}
export const createExperimentWithConditionsAndAssayTypes = async (experiment : ExperimentCreationRequiringConditionAndAssayTypeArgs) : Promise<CreatedExperimentIdAndConditionsAndAssayTypes> =>  {
    const createdExperiment = await db.experiment.create({
        select : {
            id : true,
            conditions : true,
            assayTypes : {
                select : {
                    id : true,
                    assayType : true
                }
            }
        },
        data : 
            {
                title : experiment.title,
                ownerId : experiment.ownerId,
                description : experiment.description,
                startDate : localDateToJsDate(experiment.startDate),
                isCanceled : experiment.isCanceled,
                weeks : "",
                conditions : {
                    create : experiment.conditionCreationArgsNoExperimentIdArray.map((condition) => {
                        return {
                            name : condition.name,
                            isControl : condition.isControl
                        }
                    })
                },
                assayTypes : {
                    create : experiment.assayTypeForExperimentCreationArgsArray
                }   
            }
        
    });
    return createdExperiment;
 

}