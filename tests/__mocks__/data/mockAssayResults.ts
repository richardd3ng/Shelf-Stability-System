import { AssayResult } from "@prisma/client";
import { AssayResultCreationArgs, AssayResultUpdateArgs } from "@/lib/controllers/types";

export const MockAssayResultWithCommentOnly : AssayResult = {
    comment : "Hi this is a comment",
    result : null,
    author : "Keith",
    assayId : 12,
    id : 1

}


export const MockAssayResultWithResultOnly : AssayResult = {
    comment : null,
    result : 123.45,
    author : "Keith",
    assayId : 12,
    id : 1
}


export const MockAssayResultWithCommentAndResult : AssayResult = {
    comment : "Hi this is a comment",
    result : 123.45,
    author : "Keith",
    assayId : 12,
    id : 1

}

export const mockAssayCreationArgsCommentOnly : AssayResultCreationArgs = {
    comment : "Hi this is a comment",
    result : null,
    author : "Keith",
    assayId : 12,
}


export const mockAssayCreationArgsResultOnly : AssayResultCreationArgs = {
    comment : null,
    result : 123,
    author : "Keith",
    assayId : 12,
}

export const mockAssayCreationArgsResultAndComment : AssayResultCreationArgs = {
    comment : "Hi", 
    result : 123,
    author : "ketih",
    assayId : 123
}

export const mockAssayCreationArgsNullResultAndComment : AssayResultCreationArgs = {
    comment : null,
    result : null,
    author : "Keith",
    assayId : 123
}

export const mockAssayResultUpdateArgsCommentOnly : AssayResultUpdateArgs = {
    id : 123,
    author : "Keith",
    comment : "hi"
}


export const mockAssayResultUpdateArgsResultOnly : AssayResultUpdateArgs = {
    id : 123,
    author : "Keith",
    result : 123
}

export const mockAssayResultUpdateArgsResultAndComment : AssayResultUpdateArgs = {
    id : 123,
    author : "Keith",
    comment : "hi",
    result : 123
}

export const mockAssayResultUpdateArgsNoCommentOrResult : AssayResultUpdateArgs = {
    id : 123,
    author : "Keith",
}
