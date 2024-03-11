import { Assay } from "@prisma/client";
import { AssayCreationArgs, AssayUpdateArgs } from "@/lib/controllers/types";

export const mockAssay : Assay = {
    experimentId : 1,
    conditionId : 1,
    assayTypeId : 1,
    id : 1,
    week : 1
}

export const mockAssayCreationArgs : AssayCreationArgs = {
    experimentId : 1,
    conditionId : 1,
    assayTypeId : 1,
    week : 1
}

export const mockAssayUpdateArgs : AssayUpdateArgs = {
    week : 1,
    assayTypeId : 2,
    conditionId : 1,
    id : 1
}

