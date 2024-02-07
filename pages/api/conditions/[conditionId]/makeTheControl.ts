import { getConditionID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';
import { throwErrorIfAssaysWithThisConditionHaveResult } from '@/lib/api/checkForRecordedAssays';


export default async function updateConditionAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const conditionId  = getConditionID(req);
        await throwErrorIfAssaysWithThisConditionHaveResult(conditionId);
        const condition = await db.condition.findUnique({
            where : {
                id : conditionId
            }
        });
        if (condition){
            let experimentId = condition.experimentId;
            let controlCondition = await db.condition.findFirst({
                where : {
                    experimentId : experimentId,
                    control : true
                }
            });
            if (controlCondition){
                let controlConditionId = controlCondition.id;
                const x = await db.$transaction(async (tx) => {
                    await tx.condition.update({
                        where : {
                            id : controlConditionId,
                        },
                        data : {
                            control : false
                        }
                    });
                    await tx.condition.update({
                        where : {
                            id : conditionId
                        },
                        data : {
                            control : true
                        }
                    })
                })
                
            }
        }
        
        res.status(200).json({message : "success"});
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}
