import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { ApiError } from "next/dist/server/api-utils";
import {
    INVALID_ASSAY_ID,
    getAssayID,
} from "@/lib/api/apiHelpers";
import { AssayEditInfo } from "@/lib/controllers/types";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";

export default async function fetchAssayAPI(
    req: NextApiRequest,
    res: NextApiResponse<AssayEditInfo | ApiError>
) {
    if (req.method !== "GET") {
        res.status(405).json(getApiError(405, "Method Not Allowed"));
        return;
    }

    const id = getAssayID(req);
    if (id === INVALID_ASSAY_ID) {
        res.status(400).json(getApiError(400, "Assay ID is required"));
        return;
    }

    const [assay, result, assayWithType] = await Promise.all([
        db.assayAgendaView.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                sample: true,
                targetDate: true,
                title: true,
                experimentId: true,
                condition: true,
                week: true,
                type: true,
                resultId: true,
                owner: true,
                technician: true,
                isCanceled: true,
            }
        }).then((assay) => assay == null ? assay : dateFieldsToLocalDate(assay, ['targetDate'])),
        db.assayResult.findUnique({
            where: {
                assayId: id
            },
            select: {
                result: true,
                comment: true
            }
        }),
        db.assay.findUnique({
            where: {
                id: id
            },
            select: {
                assayType: {
                    select: {
                        assayType: {
                            select: {
                                name: true,
                                units: true
                            }
                        },
                    }
                }
            }
        })
    ]);

    if (!assay || !assayWithType) {
        res.status(404).json(getApiError(404, "Assay not found"));
        return;
    }

    res.status(200).json({
        ...assay,
        units: assayWithType.assayType.assayType.units,
        resultValue: result?.result ?? null,
        resultComment: result?.comment ?? null
    });
}
