import { AssayCreationArgs, AssayResultCreationArgs } from "../../controllers/types";
import {db} from "../db";

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


