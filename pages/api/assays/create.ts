import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { CONSTRAINT_ERROR_CODE, getApiError } from "@/lib/api/error";
import { Assay } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { parseExperimentWeeks, updateExperimentWeeks } from "@/lib/api/apiHelpers";

export default async function createAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<Assay | ApiError>
) {
    let permissionTracker: APIPermissionTracker = {
        shouldStopExecuting: false,
    };
    await denyReqIfUserIsNotLoggedInAdmin(req, res, permissionTracker);
    if (permissionTracker.shouldStopExecuting) {
        return;
    }

    const { experimentId, conditionId, assayTypeId, week } = req.body;
    if (
        assayTypeId === undefined ||
        week === undefined ||
        experimentId === undefined ||
        conditionId === undefined
    ) {
        res.status(400).json(
            getApiError(
                400,
                "Assay type, week, experiment ID, and condition ID are required"
            )
        );
        return;
    }
    try {
        const createdAssay: Assay = await db.assay.create({
            data: req.body,
        });
        const experiment = await db.experiment.findFirst({
            where: {
                id: experimentId,
            },
        });
        if (experiment) {
            const weeks: number[] = parseExperimentWeeks(experiment);
            if (!weeks.includes(createdAssay.week)) {
                weeks.push(createdAssay.week);
                await updateExperimentWeeks(experiment, weeks);
            }
        }
        res.status(200).json(createdAssay);
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismError = error as Prisma.PrismaClientKnownRequestError;
            if (
                prismError.code === "P2002" &&
                Array.isArray(prismError.meta?.target) &&
                ["experimentId", "conditionId", "week", "type"].every((value) =>
                    (prismError.meta?.target as string[]).includes(value)
                )
            ) {
                res.status(CONSTRAINT_ERROR_CODE).json(
                    getApiError(
                        CONSTRAINT_ERROR_CODE,
                        "Assay with the same type and week already exists for this condition"
                    )
                );
                return;
            }
        }
        res.status(500).json(
            getApiError(500, "Failed to create assays on server")
        );
    }
}
