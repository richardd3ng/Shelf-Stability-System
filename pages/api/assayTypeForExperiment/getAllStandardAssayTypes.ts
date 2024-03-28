import { NextApiRequest, NextApiResponse } from "next";
import { APIPermissionTracker } from "@/lib/api/auth/acessDeniers";
import { denyReqIfUserIsNotLoggedInAdmin } from "@/lib/api/auth/authHelpers";
import { AssayTypeForExperiment, AssayType} from "@prisma/client";
import { db } from "@/lib/api/db";
import { getApiError } from "@/lib/api/error";
import { requireQueryFields } from "@/lib/api/apiHelpers";
import { AssayTypeInfo } from "@/lib/controllers/types";

export default async function getStandardAssayTypesAPI(
    req : NextApiRequest,
    res : NextApiResponse<AssayType[] | Error>
) {
    try{

        const allStandardAssayTypes : AssayType[] = await db.assayType.findMany({

            where : {
                isCustom : false
            }
        })
        res.status(200).json(allStandardAssayTypes);

    } catch (error) {
        res.status(500).json(
            getApiError(500, "Failed to create Assay Type on server")
        );
    }




}