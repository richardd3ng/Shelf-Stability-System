import { Experiment } from "@prisma/client";
import { mockNonAdminUser } from "./mockUsers";

export const mockExperimentWithOwnerAsNonAdmin : Experiment = {
    id : 1,
    isCanceled : false,
    ownerId : mockNonAdminUser.id,
    title : "Keith's Experiment",
    description : "Test experiment",
    startDate : new Date(2024, 0, 1, 1)
}

export const mockExperimentWithOwnerOtherThanNonAdmin : Experiment = {
    id : 1,
    isCanceled : false,
    ownerId : mockNonAdminUser.id + 5,
    title : "Keith's Experiment",
    description : "Test experiment",
    startDate : new Date(2024, 0, 1, 1)
}