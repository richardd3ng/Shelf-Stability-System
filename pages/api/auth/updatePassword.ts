import { getConditionID } from '@/lib/api/apiHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';
import {db} from "@/lib/api/db";
import { USER_ID, checkIfPasswordHasBeenSet, hashPassword } from '@/lib/api/auth/authHelpers';


export default async function updatePasswordAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const jsonData = req.body;

        const passwordHasBeenSet = await checkIfPasswordHasBeenSet();
        if (!passwordHasBeenSet){
            throw new Error("Must go through the global setup process first");
        }
        const newPassword = await hashPassword(jsonData.newPassword);
        const oldPassword = await hashPassword(jsonData.oldPassword);
        const currentDate = new Date(Date.now());
        
        const result = await db.auth.update({
            where : {
                username : USER_ID,
                password : oldPassword
            },
            data : {
                password : newPassword,
                lastUpdated : currentDate
            }
        })
        if (!result){
            throw new Error("Wrong previous password!");
        }
        res.status(200).json(jsonData);
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}
