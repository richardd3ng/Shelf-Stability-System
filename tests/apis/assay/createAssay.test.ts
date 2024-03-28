// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import createAssayAPI from '@/pages/api/assays/create';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockAdminUser, mockNonAdminUser, mockUsers } from '@/tests/__mocks__/data/mockUsers';
import { UNAUTHORIZED_STATUS_CODE } from '@/lib/api/auth/acessDeniers';
import { mockAssay, mockAssayCreationArgs } from '@/tests/__mocks__/data/mockAssays';



jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        assay : {
            create : jest.fn()
        }
    },
}));




describe('/api/assay/create', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'POST',
            body : mockAssayCreationArgs
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('rejects request from non-admin', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockNonAdminUser);

        await createAssayAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED_STATUS_CODE);
        
    });

    it("succeeds in standard case", async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (db.assay.create as jest.Mock).mockResolvedValueOnce(mockAssay);
        await createAssayAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAssay);
    })

  
});
