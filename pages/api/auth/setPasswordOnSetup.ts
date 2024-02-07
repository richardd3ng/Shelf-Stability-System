import { getConditionID } from '@/lib/api/apiHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { getErrorMessage } from '@/lib/api/apiHelpers';
import {db} from "@/lib/api/db";
import { USER_ID, checkIfPasswordHasBeenSet, hashPassword } from '@/lib/api/auth/authHelpers';


export default async function setPasswordOnSetupAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const passwordHasBeenSet = await checkIfPasswordHasBeenSet();
        if (passwordHasBeenSet){
            throw new Error("Password has already been set");
        }

        const jsonData = req.body;
        const newPassword = await hashPassword(jsonData.newPassword);
        const currentDate = new Date(Date.now());
        await db.auth.create({
            data : {
                password : newPassword,
                lastUpdated : currentDate,
                username : USER_ID
            }
        })
        res.status(200).json(jsonData);
        
    } catch (error) {
        let errorMsg = getErrorMessage(error);
        res.status(500).json({ error: errorMsg});
    }
}

