import { User } from "@prisma/client";
import { UserInfo } from "@/lib/controllers/types";
import { mockToken } from "../next-auth-jwt";

  
export const mockSuperAdminUser : User = {
    id : mockToken.id,
    username : mockToken.name,
    isAdmin : true,
    isSuperAdmin : true,
    password : ""
}

export const mockAdminUser : User = {
    id : mockToken.id,
    username : mockToken.name,
    isAdmin : true,
    isSuperAdmin : false,
    password : ""
}

export const mockNonAdminUser : User = {
    id : mockToken.id,
    username : mockToken.name,
    isAdmin : false,
    isSuperAdmin : false,
    password : ""
}

export const mockUsers : UserInfo[] = [
    {
        id : mockToken.id,
        username : mockToken.name,
        isAdmin : false
    },
    {
        id : 2,
        username : "Ricky",
        isAdmin : true
    },
    {
        id : 3,
        username : "Richard",
        isAdmin : true
    }
];