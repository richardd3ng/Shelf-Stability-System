import { AssayCreationArgs, AssayResultCreationArgs } from "../../lib/controllers/types";
import {db} from "../../lib/api/db";

export const createAssayResults = async (assayResults : AssayResultCreationArgs[]) => {
    await db.assayResult.createMany({
        data : assayResults.map((assayResult) => {
            return {
                assayId : assayResult.assayId,
                result : assayResult.result,
                comment : assayResult.comment,
                author : assayResult.author
            };
        })
            
    });
    


}


