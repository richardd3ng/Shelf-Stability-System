// __tests__/api/users.test.ts

import { NextApiRequest, NextApiResponse } from 'next';
import updateAssayResultAPI from '@/pages/api/assayResult/[assayResultId]/update';
import { db } from '@/lib/api/db';
import "next-auth/jwt"
import "next-auth/client"
import { mockAdminUser, mockNonAdminUser, mockUsers } from '@/tests/__mocks__/data/mockUsers';
import { UNAUTHORIZED_STATUS_CODE } from '@/lib/api/auth/acessDeniers';
import { MockAssayResultWithCommentAndResult, mockAssayResultUpdateArgsCommentOnly } from '@/tests/__mocks__/data/mockAssayResults';
import { mockExperimentWithOwnerAsNonAdmin, mockExperimentWithOwnerOtherThanNonAdmin } from '@/tests/__mocks__/data/mockExperiments';



jest.mock('@/lib/api/db', () => ({
    db: {
        user: {
            findMany: jest.fn(),
            findUnique : jest.fn(),
            count : jest.fn()
        },
        assayResult : {
            update : jest.fn(),
            delete : jest.fn(),
            findUnique : jest.fn(),

        },
        experiment : {
            findUnique : jest.fn()
        }
    },
}));



describe('/api/assayResult/[assayResultId]/update', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'POST',
            body : mockAssayResultUpdateArgsCommentOnly,
            query : {
                "assayResultId" : "1"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('rejects request from non-admin non-owner', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockNonAdminUser);
        (db.assayResult.findUnique as jest.Mock).mockResolvedValueOnce({
            ...MockAssayResultWithCommentAndResult,
            assay : {
                experimentId : mockExperimentWithOwnerOtherThanNonAdmin.id
            }
        });
        (db.experiment.findUnique as jest.Mock).mockResolvedValueOnce(mockExperimentWithOwnerOtherThanNonAdmin);
        await updateAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(UNAUTHORIZED_STATUS_CODE);
        
    });

    it('succeeds when called by admin', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdminUser);
        (db.assayResult.findUnique as jest.Mock).mockResolvedValueOnce({
            ...MockAssayResultWithCommentAndResult,
            assay : {
                experimentId : mockExperimentWithOwnerAsNonAdmin.id
            }
        });
        (db.experiment.findUnique as jest.Mock).mockResolvedValueOnce(mockExperimentWithOwnerAsNonAdmin);
        (db.assayResult.update as jest.Mock).mockResolvedValueOnce(mockAssayResultUpdateArgsCommentOnly);
        await updateAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it ('succeeds when called by experiment owner', async () => {
        (db.user.findUnique as jest.Mock).mockResolvedValueOnce(mockNonAdminUser);
        (db.assayResult.findUnique as jest.Mock).mockResolvedValueOnce({
            ...MockAssayResultWithCommentAndResult,
            assay : {
                experimentId : mockExperimentWithOwnerAsNonAdmin.id
            }
        });
        (db.experiment.findUnique as jest.Mock).mockResolvedValueOnce(mockExperimentWithOwnerAsNonAdmin);
        (db.assayResult.update as jest.Mock).mockResolvedValueOnce(mockAssayResultUpdateArgsCommentOnly);
        await updateAssayResultAPI(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(200);
    })

  
});
