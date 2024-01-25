import {db} from "@/lib/api/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getExperimentID } from "@/lib/api/apiHelpers";
import { ExperimentInfo } from "@/lib/controllers/types";

export default async function getExperimentInfo(req: NextApiRequest, res: NextApiResponse<ExperimentInfo>) {
    const experimentId = getExperimentID(req);
    
    const [experiment, conditions, assays, assayTypes] = await Promise.all([
        db.experiment.findUnique({
            where: { id: experimentId}
        }),
        db.condition.findMany({
            where: { experimentId: experimentId}
        }),
        db.assay.findMany({
            where: { experimentId: experimentId}
        }),
        db.assayType.findMany({
            where : {experimentId : experimentId}
        })
    ]);          

    res.status(200).json({experiment, conditions, assayTypes, assays});
}