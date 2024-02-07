import { getExperimentID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';


export default async function updateExperimentAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const experimentId  = getExperimentID(req);
        const jsonData = req.body;
        const newTitle = jsonData.title;
        const newDescription = jsonData.description;
        const newStartDate = new Date(jsonData.startDate);
        const shouldUpdateStartDate = jsonData.shouldUpdateStartDate;
        if (shouldUpdateStartDate){
            await db.experiment.update({
                where : {
                    id : experimentId
                },
                data : {
                    title : newTitle,
                    description : newDescription,
                    start_date : newStartDate
                }
            })
        } else {
            await db.experiment.update({
                where : {
                    id : experimentId
                },
                data : {
                    title : newTitle,
                    description : newDescription,
                }
            })
        }
        res.status(200).json(jsonData);
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}
