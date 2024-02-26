// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fetchUserList from '../pages/api/users/list';
import { UserInfo, UserTable } from '../lib/controllers/types';
import { User } from '@prisma/client';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockToken } from './__mocks__/next-auth-jwt';



const mockUsers : UserInfo[] = [
    {
        id : 1,
        username : "keith",
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

const mockAdminUser : User = {
    id : mockToken.id,
    username : mockToken.name,
    is_admin : true,
    is_super_admin : false,
    password : ""

}

jest.mock('../lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
    },
}));

jest.mock('next-auth/client');
jest.mock('next-auth/jwt');



describe('/api/users', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'GET',
            
            query: {
                "page" : "0",
                "page_size" : "15",

            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('returns a list of users', async () => {
        (db.user.count as jest.Mock).mockResolvedValue(3);
        (db.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);

        await fetchUserList(req as NextApiRequest, res as NextApiResponse);
        console.log(res.status);
        console.log("in the retun users test");
        expect(res.status).toHaveBeenCalledWith(200);
        
    });

  
});
