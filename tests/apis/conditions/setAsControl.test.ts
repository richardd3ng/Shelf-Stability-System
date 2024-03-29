// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import setConditionAsControlAPI from '@/pages/api/conditions/[conditionId]/setAsControl';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockAdminUser, mockNonAdminUser, mockUsers } from '@/tests/__mocks__/data/mockUsers';
import { UNAUTHORIZED_STATUS_CODE } from '@/lib/api/auth/acessDeniers';
import { mockCondition, mockControlCondition } from '@/tests/__mocks__/data/mockConditions';



jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        condition : {
            delete : jest.fn(),
            findUnique : jest.fn(),
            findFirst : jest.fn(),
            update : jest.fn()
        },
        $transaction : jest.fn()
    },
}));


describe('/api/conditions/[conditionId]/setAsControl', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'GET',
            query :{
                "conditionId" : "1"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('rejects request from non-admin', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockNonAdminUser);

        await setConditionAsControlAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED_STATUS_CODE);
        
    });
    


  
});
