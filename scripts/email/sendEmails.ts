import { fetchEmailInfo } from "../../lib/api/dbOperations/userOperations";
import { EmailInfo } from "../../lib/controllers/types";
import sgMail from "@sendgrid/mail";

export const sendEmails = async () => {
    console.log("sending emails...");
    const emailInfo: EmailInfo = await fetchEmailInfo();
    try {
        if (process.env.SENDGRID_API_KEY === undefined) {
            throw new Error("SENDGRID_API_KEY not found");
        }
        if (process.env.SENDER_EMAIL === undefined) {
            throw new Error("Sender email not set");
        }
        const senderEmail = process.env.SENDER_EMAIL;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        Object.entries(emailInfo).forEach(([_userId, data]) => {
            console.log("sending email to: ", data.email);
            let agendaItemsHtml = "";

            data.agenda.forEach((agendaItem) => {
                agendaItemsHtml += `
                <tr style="cursor: pointer; border-bottom: 1px solid #ccc;">
                    <td>${agendaItem.targetDate}</td>
                    <td><a href="https://shelf-stability-system.colab.duke.edu/experiments/${agendaItem.experimentId}">${agendaItem.title}</a></td>
                    <td>${agendaItem.owner}</td>
                    <td>${agendaItem.condition}</td>
                    <td>${agendaItem.week}</td>
                    <td>${agendaItem.assayType}</td>
                    <td>${agendaItem.technician}</td>
                </tr>
                <tr style="height: 5px;"><td colspan="7"></td></tr>`;
            });

            const tableHtml = `
                <table style="border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 8px 8px 8px 0; text-align: left;">Target Date</th>
                            <th style="padding: 8px 8px 8px 0; text-align: left;">Title</th>
                            <th style="padding: 8px 8px 8px 0; text-align: left;">Owner</th>
                            <th style="padding: 8px 8px 8px 0; text-align: left;">Condition</th>
                            <th style="padding: 8px 8px 8px 0; text-align: left;">Week</th>
                            <th style="padding: 8px 8px 8px 0; text-align: left;">Assay Type</th>
                            <th style="padding: 8px 8px 8px 0; text-align: left;">Technician</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${agendaItemsHtml}
                    </tbody>
                </table>`;

            const msg = {
                to: data.email,
                from: senderEmail,
                subject: "HM Labs: Upcoming Assay Reminder (2)",
                html: `<p>You are listed as the owner and/or technician for the following upcoming assays in Shelf Stability System:</p>
        ${tableHtml}`,
            };
            sgMail.send(msg);
        });
        console.log("Successfully sent emails!");
    } catch (error) {
        console.error(error);
    }
};