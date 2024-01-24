import { NextApiRequest } from "next";
import { INVALID_EXPERIMENT_ID } from "../hooks/useExperimentId";

export const getExperimentID = (req: NextApiRequest) : number => {
    return req.query.experimentId? Number(req.query.experimentId.toString()) : INVALID_EXPERIMENT_ID;
}