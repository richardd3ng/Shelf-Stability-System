// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import createConditionAPI from '@/pages/api/conditions/create';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockAdminUser, mockNonAdminUser, mockUsers } from '@/tests/__mocks__/data/mockUsers';
import { UNAUTHORIZED_STATUS_CODE } from '@/lib/api/auth/acessDeniers';



jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        condition : {
            create : jest.fn()
        }
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
            body : {
                "experimentId" : 1,
                "name" : "myCondition",
                "control" : false

            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('rejects request from non-admin', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockNonAdminUser);

        await createConditionAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED_STATUS_CODE);
        
    });

  
});
