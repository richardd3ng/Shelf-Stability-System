import { getAssayID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';


export default async function deleteAssayResultAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const assayId  = getAssayID(req);
        await db.assay.update({
            where : {
                id : assayId
            },
            data : {
                result : null
            }
        })
        res.status(200).json({message : "success!"});
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}
