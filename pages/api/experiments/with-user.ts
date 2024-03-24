import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/api/db";
import { ApiError } from "next/dist/server/api-utils";
import { getApiError } from "@/lib/api/error";
import { ExperimentWithLocalDate } from "@/lib/controllers/types";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";

/**
 * @swagger
 * definitions:
 *   Experiment:
 *     required:
 *       - id
 *       - title
 *       - description
 *       - startDate
 *       - isCanceled
 *       - ownerId
 *     properties:
 *       id:
 *         type: number
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       startDate:
 *         type: string
 *       isCanceled:
 *         type: boolean
 *       ownerId:
 *         type: number
 */

/**
 *  @swagger
 *  /api/experiments/with-user:
 *    get:
 *      summary: Gets all experiments associated (owner or technician) with a user
 *      tags: [Experiments, Users]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          in: query
 *          required: true
 *          type: number
 *      responses:
 *        200:
 *          description: The user with that ID
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              $ref: '#/definitions/Experiment'
 *        400:
 *          description: Invalid id
 * 
 */
export default async function getAssociatedExperiments(
    req: NextApiRequest,
    res: NextApiResponse<ExperimentWithLocalDate[] | ApiError>
) {
    try {
        if (req.method !== "GET") {
            res.status(405).json(getApiError(405, "Method not allowed"));
            return;
        }
        const ownerId = Number(req.query.id);
        if (isNaN(ownerId)) {
            res.status(400).json(getApiError(400, "Invalid owner"));
            return;
        }

        const experiments = await db.experiment.findMany({
            where: {
                OR: [
                    {
                        ownerId: ownerId
                    },
                    {
                        assayTypes: {
                            some: {
                                technicianId: ownerId
                            }
                        }
                    }
                ]
            }
        }).then((experiments) => experiments.map((experiment) => dateFieldsToLocalDate(experiment, ["startDate"])));

        res.status(200).json(experiments);
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Failed to search for experiments")
        );
    }
}
