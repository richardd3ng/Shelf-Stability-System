import { getAssayID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';


export default async function updateAssayResultAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const assayId  = getAssayID(req);
        const jsonData = req.body;
        const newResult = jsonData.result;
        await db.assay.update({
            where : {
                id : assayId
            },
            data : {
                result : newResult
            }
        })
        res.status(200).json(jsonData);
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}