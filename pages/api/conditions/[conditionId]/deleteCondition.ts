import { getAssayTypeID, getConditionID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';
import { throwErrorIfAssaysWithThisConditionHaveResult } from '@/lib/api/checkForRecordedAssays';


export default async function deleteConditionAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const conditionId  = getConditionID(req);
        await throwErrorIfThisIsTheControl(conditionId);
        await throwErrorIfAssaysWithThisConditionHaveResult(conditionId);
        await db.condition.delete({
            where : {
                id : conditionId
            }
        })
        res.status(200).json({message : "success!"});
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}

async function throwErrorIfThisIsTheControl(conditionId : number){
    const condition = await db.condition.findUnique({
        where : {
            id : conditionId
        }
    });
    if (condition) {
        if (condition.control){
            if (condition.control === true){
                throw new Error("Cannot delete the control");
            }
        }
    }
}