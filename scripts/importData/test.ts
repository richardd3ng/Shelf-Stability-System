import { Assay, AssayResult } from "@prisma/client";
import { db } from "../../lib/api/db";

async function run(){
    const experimentAssayResults: AssayResult[] = [];
    const x = await Promise.all(
        [278, 278, 284].map(async (id : number) => {
            const assayResults: AssayResult[] =
                await db.assayResult.findMany({
                    where: { assayId: id },
                });
            experimentAssayResults.push(...assayResults);
        })
    );
    console.log(experimentAssayResults);

}

run();