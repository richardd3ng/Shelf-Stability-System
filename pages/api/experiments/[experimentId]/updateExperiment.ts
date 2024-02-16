import { getExperimentID } from '@/lib/api/apiHelpers';
import { db } from '@/lib/api/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { experimentHasAssaysWithResults } from '@/lib/api/checkForRecordedAssays';
import { getApiError } from '@/lib/api/error';
import { Prisma } from '@prisma/client';
import { TITLE_IS_TAKEN_CODE } from '@/lib/controllers/experimentController';
import { localDateToJsDate } from '@/lib/datesUtils';
import { LocalDate } from '@js-joda/core';

export default async function updateExperimentAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const experimentId = getExperimentID(req);
        const jsonData = req.body;
        const newTitle = jsonData.title;
        const newDescription = jsonData.description;
        const shouldUpdateStartDate = jsonData.shouldUpdateStartDate;

        if (shouldUpdateStartDate && await experimentHasAssaysWithResults(experimentId)) {
            res.status(400).json(getApiError(400, "Experiment has recorded assay results. The start date cannot be changed."));
            return;
        }

        await db.experiment.update({
            where: {
                id: experimentId
            },
            data: {
                title: newTitle,
                description: newDescription,
                start_date: shouldUpdateStartDate ? localDateToJsDate(LocalDate.parse(jsonData.startDate)) : undefined
            }
        });

        res.status(200).json(jsonData);

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002" && (error.meta?.target as string[])?.includes("title")) {
                res.status(TITLE_IS_TAKEN_CODE).json(
                    getApiError(TITLE_IS_TAKEN_CODE, `An experiment with the name ${req.body.title} already exists.`)
                );
                return;
            }
        }
        
        res.status(500).json(
            getApiError(500, "Failed to create experiment on server")
        );
    }
}
