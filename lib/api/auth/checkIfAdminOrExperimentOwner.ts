import { db } from '../db';
import { NextApiResponse, NextApiRequest } from 'next';
import { UserWithoutPassword } from '@/lib/controllers/types';
import { APIPermissionTracker, denyAPIReq } from './acessDeniers';

// This function can be marked `async` if using `await` inside
export async function denyReqIfUserIsNeitherAdminNorExperimentOwner(req : NextApiRequest, res : NextApiResponse, user : UserWithoutPassword, experimentId : number, permissionTracker : APIPermissionTracker) {
    try{
        const isAdmin = user.isAdmin;
        const isOwner = await checkIfUserIsExperimentOwner(user, experimentId);
        if (isAdmin || isOwner){
            return;
        } else {
            denyAPIReq(req, res, "You are neither an admin nor an owner", permissionTracker);
        }
            
    } catch {
        return res.redirect('/experiment-list');
    }
}

export async function denyReqIfUserIsNotAdmin(req : NextApiRequest, res : NextApiResponse, user : UserWithoutPassword, permissionTracker : APIPermissionTracker){
    if (!user.isAdmin){
        await denyAPIReq(req, res, "You are not an admin", permissionTracker);
    }
}



export const checkIfUserIsAdmin = async ( username : string ) : Promise<boolean> => {
    try{
        const user = await db.user.findUnique({
            where : {
                username : username
            }
        });
        if (user && user.isAdmin){
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}



const checkIfUserIsExperimentOwner = async (user : UserWithoutPassword, experimentId : number) : Promise<boolean> => {
    try{
        const experiment = await db.experiment.findUnique({
            where : {
                id : experimentId
            }
        });
        if (experiment && experiment.ownerId === user.id){
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
    

}