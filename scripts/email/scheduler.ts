import schedule from "node-schedule";
import { sendEmails } from "./sendEmails";

export const scheduleEmails = () => {
    console.log("running email scheduler");
    // Schedule to run every Monday at 8am ET
    // change this to monday ET
    const job = schedule.scheduleJob(
        { hour: 8, minute: 0, dayOfWeek: 2, tz: "America/New_York" },
        function () {
            sendEmails();
        }
    );
};
