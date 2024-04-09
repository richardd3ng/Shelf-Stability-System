import { hash } from "bcryptjs";
import { db } from "../db";
import { NextApiResponse, NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { UserWithoutPassword } from "../../controllers/types";
import { APIPermissionTracker, denyAPIReq } from "./acessDeniers";
import { denyReqIfUserIsNotAdmin } from './acessDeniers';


export const ADMIN_USERNAME = "admin";
export const ADMIN_DISPLAY_NAME = "Admin";


const SALT = 15;

export const hashPassword = async (password: string): Promise<string> => {
    return await hash(password, SALT);
};

export const checkIfAdminExists = async (): Promise<boolean> => {
    try {
        const existingAdmin = await db.user.findFirst({
            where: {
                isSuperAdmin: true,
            },
        });
        if (existingAdmin) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};


//meant to be used with backend apis that can only be accessed by loggged in users 
export async function getUserAndDenyReqIfUserIsNotLoggedIn(req: NextApiRequest, res : NextApiResponse, permissionTracker : APIPermissionTracker) : Promise<UserWithoutPassword | null> {
    try{
        const token = await getToken({req : req});
        if (!token || !token.name){
            await denyAPIReq(req, res, "You must be logged in", permissionTracker);
        } else {
            const user = await db.user.findUnique({
                where : {
                    username : token.name
                },
                select : {
                    id : true,
                    username : true,
                    isAdmin : true,
                    isSuperAdmin : true,
                    isSSO : true,
                    displayName : true,
                    email : true,

                    password : false,
                    
                }
            });
            if (user) {
                return user;
            } else {
                await denyAPIReq(req, res, "You are not a valid user", permissionTracker);
            }
        }

    } catch {
        await denyAPIReq(req, res, "You must be logged in", permissionTracker);
    }
    return null;
}

export async function denyReqIfUserIsNotLoggedInAdmin(req : NextApiRequest, res : NextApiResponse, permissionTracker : APIPermissionTracker){
    const user = await getUserAndDenyReqIfUserIsNotLoggedIn(req, res, permissionTracker);
    if (user){
        await denyReqIfUserIsNotAdmin(req, res, user, permissionTracker);
    }
}

export const checkIfUserIsAdmin = async (username: string): Promise<boolean> => {
    try {
        const user = await db.user.findUnique({
            where: {
                username: username
            }
        });
        if (user && user.isAdmin) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
};

export const checkIfUserIsExperimentOwner = async (user: UserWithoutPassword, experimentId: number): Promise<boolean> => {
    try {
        const experiment = await db.experiment.findUnique({
            where: {
                id: experimentId
            }
        });
        if (experiment && experiment.ownerId === user.id) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }


};



