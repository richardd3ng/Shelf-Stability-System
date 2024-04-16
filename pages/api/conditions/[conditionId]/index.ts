import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";
import { Condition } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

/**
   * @swagger
   * definitions:
   *   Condition:
   *     required:
   *       - id
   *       - experimentId
   *       - name
   *       - isControl
   *     properties:
   *       id:
   *         type: number
   *       experimentId:
   *         type: number
   *       name:
   *         type: string
   *       isControl:
   *         type: boolean
   */

export default async function accessConditionAPI(
    req: NextApiRequest,
    res: NextApiResponse<Condition | ApiError>
) {
    try {
        var conditionId: number;
        try {
            conditionId = Number(req.query.conditionId);

            if (isNaN(conditionId)) {
                res.status(400).json(
                    getApiError(400, "Invalid condition ID")
                );
                return;
            }
        } catch (error) {
            res.status(400).json(
                getApiError(400, "Invalid condition ID")
            );
            return;
        }

        if (req.method === "GET") {
            await getCondition(conditionId, req, res);
        } else {
            res.status(405).json(
                getApiError(405, "Method not allowed")
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Internal server error")
        );
    }
}

/**
 *  @swagger
 *  /api/conditions/{conditionId}:
 *    get:
 *      summary: Gets a specific condition
 *      tags: [Conditions]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: conditionId
 *          in: path
 *          required: true
 *          type: number
 *      responses:
 *        200:
 *          description: The condition with that ID
 *          schema:
 *            type: object
 *            $ref: '#/definitions/Condition'
 *        404:
 *          description: Condition not found
 * 
 */
async function getCondition(conditionId: number, _req: NextApiRequest, res: NextApiResponse<Condition | ApiError>): Promise<void> {
    const condition = await db.condition.findUnique({
        where: {
            id: conditionId,
        },
    });

    if (condition === null) {
        res.status(404).json(
            getApiError(404, `Condition with ID ${conditionId} not found`)
        );
    } else {
        res.status(200).json(condition);
    }
}