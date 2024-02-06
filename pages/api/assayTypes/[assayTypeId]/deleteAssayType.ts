import { getAssayTypeID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';


export default async function deleteAssayTypeAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const assayTypeId  = getAssayTypeID(req);
        await db.assayType.delete({
            where : {
                id : assayTypeId
            }
        })
        res.status(200).json({message : "success!"});
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}
