// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fetchAssayAPI from '@/pages/api/assays/[assayId]';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockAdminUser,  } from '@/tests/__mocks__/data/mockUsers';
import { mockAssay,  } from '@/tests/__mocks__/data/mockAssays';

jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        assay : {
            findUnique : jest.fn()
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
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('fails when assay does not exist', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (db.assay.findUnique as jest.Mock).mockResolvedValueOnce(null);
        await fetchAssayAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(404);
    })

    it('succeeds in standard case', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (db.assay.findUnique as jest.Mock).mockResolvedValueOnce(mockAssay);
        await fetchAssayAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAssay);
    })

  
});
