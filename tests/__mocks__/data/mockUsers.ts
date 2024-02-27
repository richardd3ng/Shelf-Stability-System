import { User } from "@prisma/client";
import { UserInfo } from "@/lib/controllers/types";
import { mockToken } from "../next-auth-jwt";

  
export const mockSuperAdminUser : User = {
    id : mockToken.id,
    username : mockToken.name,
    is_admin : true,
    is_super_admin : true,
    password : ""
}

export const mockAdminUser : User = {
    id : mockToken.id,
    username : mockToken.name,
    is_admin : true,
    is_super_admin : false,
    password : ""
}

export const mockNonAdminUser : User = {
    id : mockToken.id,
    username : mockToken.name,
    is_admin : false,
    is_super_admin : false,
    password : ""
}

export const mockUsers : UserInfo[] = [
    {
        id : mockToken.id,
        username : mockToken.name,
        is_admin : false
    },
    {
        id : 2,
        username : "Ricky",
        is_admin : true
    },
    {
        id : 3,
        username : "Richard",
        is_admin : true
    }
];