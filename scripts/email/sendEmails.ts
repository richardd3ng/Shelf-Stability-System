import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "sendgrid.env") });

async function sendEmails() {
    console.log("sending emails...");
    const addresses: string[] = ["rld39@duke.edu", "rdengomg@gmail.com"];
    // const addresses = await fetchEmails();
    try {
        if (process.env.SENDGRID_API_KEY === undefined) {
            throw new Error("SENDGRID_API_KEY not found");
        }
        if (process.env.SENDER_EMAIL === undefined) {
            throw new Error("Sender email not set");
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        for (let address of addresses) {
            console.log("sending email to: ", address);
            const msg = {
                to: address,
                from: process.env.SENDER_EMAIL,
                subject: "HM Labs: Upcoming Assay Reminder (2)",
                text: "and easy to do anywhere, even with Node.js",
                html: "<strong>and easy to do anywhere, even with Node.js</strong>",
            };
            // await sgMail.send(msg);
        }
        console.log("Successfully sent emails!");
    } catch (error) {
        console.error(error);
    }
}

sendEmails();
