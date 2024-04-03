import { requireQueryFields } from "@/lib/api/apiHelpers";
import { db } from "@/lib/api/db";
import { dateFieldsToLocalDate } from "@/lib/controllers/jsonConversions";
import { generateLabelPdf } from "@/lib/generateLabels";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json(new ApiError(405, 'Method not allowed'));
    }

    const fields = requireQueryFields(req, ['experimentId'], {});

    if (fields instanceof ApiError) {
        return res.status(fields.statusCode).json(fields);
    }

    const { experimentId } = {
        experimentId: parseInt(fields.experimentId)
    };

    if (isNaN(experimentId)) {
        return res.status(400).json(new ApiError(400, 'Invalid experiment ID'));
    }

    const data = await db.assayAgendaView.findMany({
        where: {
            experimentId
        }
    }).then(assayAgenda =>
        assayAgenda.map(agenda =>
            dateFieldsToLocalDate(agenda, ['targetDate'])));

    res.setHeader(
        'Content-Disposition',
        `attachment; filename="labels.pdf"`
    );
    res.setHeader('Content-Type', 'application/pdf');

    const pdf = await generateLabelPdf(data);
    const bytes = await pdf.save();

    return res.send(Buffer.from(bytes));
};