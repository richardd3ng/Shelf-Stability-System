// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import deleteConditionAPI from '@/pages/api/conditions/[conditionId]/delete';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { conditionHasAssaysWithResults, conditionIsControl } from '@/lib/api/validations';
import { mockAdminUser, mockNonAdminUser, mockUsers } from '@/tests/__mocks__/data/mockUsers';
import { UNAUTHORIZED_STATUS_CODE } from '@/lib/api/auth/acessDeniers';
import { mockCondition } from '@/tests/__mocks__/data/mockConditions';
import { CONSTRAINT_ERROR_CODE } from '@/lib/api/error';



jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        condition : {
            delete : jest.fn()
        }
    },
}));


jest.mock("@/lib/api/validations");


describe('/api/conditions/[conditionId]/delete', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'DELETE',
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

        await deleteConditionAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED_STATUS_CODE);
        
    });
    it('rejects request when condition has results', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (conditionIsControl as jest.Mock).mockResolvedValueOnce(false);
        (conditionHasAssaysWithResults as jest.Mock).mockResolvedValueOnce(true);
        (db.condition.delete as jest.Mock).mockResolvedValueOnce(mockCondition);
        await deleteConditionAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(CONSTRAINT_ERROR_CODE);
    });

    it('deletes and returns condition in success case', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (conditionIsControl as jest.Mock).mockResolvedValueOnce(false);
        (conditionHasAssaysWithResults as jest.Mock).mockResolvedValueOnce(false);
        (db.condition.delete as jest.Mock).mockResolvedValueOnce(mockCondition);
        await deleteConditionAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCondition);
    })

  
});
