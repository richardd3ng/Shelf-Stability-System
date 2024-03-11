import { Condition } from "@prisma/client";
import { ConditionCreationArgs } from "@/lib/controllers/types";

export const mockCondition : Condition = {
    isControl : false,
    id : 1,
    name : "Condition1",
    experimentId : 1
}

export const mockControlCondition : Condition = {
    isControl : true,
    id : 1,
    name : "Condition1",
    experimentId : 1
}
