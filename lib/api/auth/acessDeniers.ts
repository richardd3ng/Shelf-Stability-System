import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { getApiError } from "../error";

export const UNAUTHORIZED_STATUS_CODE = 403;

export async function denyAPIReq(req : NextApiRequest, res : NextApiResponse, message : string){
    res.status(UNAUTHORIZED_STATUS_CODE).json(getApiError(UNAUTHORIZED_STATUS_CODE, message));

}

