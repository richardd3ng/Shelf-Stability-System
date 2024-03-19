// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import createAssayResultAPI from '@/pages/api/assayResult/create';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockAdminUser, mockNonAdminUser, mockUsers } from '@/tests/__mocks__/data/mockUsers';
import { UNAUTHORIZED_STATUS_CODE } from '@/lib/api/auth/acessDeniers';
import { MockAssayResultWithCommentAndResult, MockAssayResultWithCommentOnly, MockAssayResultWithResultOnly, mockAssayCreationArgsCommentOnly, mockAssayCreationArgsNullResultAndComment, mockAssayCreationArgsResultAndComment, mockAssayCreationArgsResultOnly } from '@/tests/__mocks__/data/mockAssayResults';



jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        assayResult : {
            create : jest.fn()
        }
    },
}));


describe('/api/assayResult/create', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'POST',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('rejects request from non-admin', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockNonAdminUser);

        await createAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED_STATUS_CODE);
        
    });

    it("succeeds in standard case with comment", async () => {
        req.body = mockAssayCreationArgsCommentOnly;
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (db.assayResult.create as jest.Mock).mockResolvedValueOnce(MockAssayResultWithCommentOnly)
        await createAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(MockAssayResultWithCommentOnly);

    })

    it("succeeds in standard case with result", async () => {
        req.body = mockAssayCreationArgsResultOnly;
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (db.assayResult.create as jest.Mock).mockResolvedValueOnce(MockAssayResultWithResultOnly)
        await createAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(MockAssayResultWithResultOnly);

    })

    it("succeeds in standard case with result and comment", async () => {
        req.body = mockAssayCreationArgsResultAndComment;
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (db.assayResult.create as jest.Mock).mockResolvedValueOnce(MockAssayResultWithCommentAndResult)
        await createAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(MockAssayResultWithCommentAndResult);

    })

    it("Fails given null result and comment", async () => {
        req.body = mockAssayCreationArgsNullResultAndComment;
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        await createAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(400);
    })
  
});
