import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
import { db } from '../db';
import { NextApiResponse } from 'next';
import { getApiError } from '../error';
// This function can be marked `async` if using `await` inside
export async function redirectOrBlockIfUserIsNeitherAdminNorExperimentOwner(req: NextRequest, res : NextApiResponse, experimentId : number, mustBeAdmin : boolean) {
    try{
        const token = await getToken({req : req});
                
        if (!token || !token.name){
            redirectOrBlock(req, res);
        } else {
            const isAdmin = await checkIfUserIsAdmin(token.name);
            const isOwner = await checkIfUserIsExperimentOwner(token.name, experimentId);
            if (mustBeAdmin){
                if (isAdmin){
                    return;
                } else {
                    redirectOrBlock(req, res);
                }
            } else {
                if (isAdmin || isOwner){
                    return;
                } else {
                    redirectOrBlock(req, res);
                }
            }
        }
        
        
    } catch {
        return res.redirect('/experiment-list');
    }

}

async function redirectOrBlock(req : NextRequest, res : NextApiResponse){
    if (req.nextUrl.pathname.startsWith("/api")){
        return NextResponse.json(getApiError(400, "You are neither an admin nor the owner of this experiment", "Neither Admin Nor Owner"))
    } else {
        return NextResponse.redirect(new URL('/experiment-list'))
    };
}

export const checkIfUserIsAdmin = async ( username : string ) : Promise<boolean> => {
    try{
        const user = await db.user.findUnique({
            where : {
                username : username
            }
        });
        if (user && user.is_admin){
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}



const checkIfUserIsExperimentOwner = async (username : string, experimentId : number) : Promise<boolean> => {
    try{
        const user = await db.user.findUnique({
            where : {
                username : username
            }
        });
        if (user){
            const experiment = await db.experiment.findUnique({
                where : {
                    id : experimentId
                }
            });
            if (experiment && experiment.ownerId === user.id){
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
    

}