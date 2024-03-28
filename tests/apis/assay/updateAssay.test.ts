// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import updateAssayAPI from '@/pages/api/assays/[assayId]/update';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockAdminUser, mockNonAdminUser, mockUsers } from '@/tests/__mocks__/data/mockUsers';
import { UNAUTHORIZED_STATUS_CODE } from '@/lib/api/auth/acessDeniers';
import { assayHasResult } from '@/lib/api/validations';
import { CONSTRAINT_ERROR_CODE } from '@/lib/api/error';
import { mockAssay, mockAssayUpdateArgs } from '@/tests/__mocks__/data/mockAssays';

jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        assay : {
            update : jest.fn()
        }
    },
}));


jest.mock("@/lib/api/validations");

describe('/api/assayResult/[assayResultId]/update', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'POST',
            query : {
                "assayId" : "1"
            }, body : JSON.stringify(mockAssayUpdateArgs)
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('rejects request from non-admin', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockNonAdminUser);

        await updateAssayAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED_STATUS_CODE);
        
    });
    it('rejects request if assay has results', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (assayHasResult as jest.Mock).mockResolvedValueOnce(true);
        await updateAssayAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(CONSTRAINT_ERROR_CODE);
    });

    it('succeeds in standard case', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (assayHasResult as jest.Mock).mockResolvedValueOnce(false);
        (db.assay.update as jest.Mock).mockResolvedValueOnce(mockAssay);
        await updateAssayAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAssay);
    })

  
});
