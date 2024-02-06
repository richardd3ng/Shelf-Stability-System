import { getAssayID, getAssayTypeID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';


export default async function updateAssayTypeAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const assayTypeId  = getAssayTypeID(req);
        const jsonData = req.body;
        const newName = jsonData.name;
        await db.assayType.update({
            where : {
                id : assayTypeId
            },
            data : {
                name : newName
            }
        })
        res.status(200).json(jsonData);
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}
