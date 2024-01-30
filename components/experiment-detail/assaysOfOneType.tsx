import { Typography, Container} from "@mui/material";
import { AssayType } from "@prisma/client";
import React from "react";
import { ExperimentTable } from "./experimentTable/experimentTable";
import { ExperimentInfo } from "@/lib/controllers/types";

interface AssaysOfOneTypeProps{
    experimentId : number;
    assayType : AssayType;
}
export const AssaysOfOneType : React.FC<AssaysOfOneTypeProps> = (props : AssaysOfOneTypeProps) => {
    return (
        <Container>
            <Typography>Assays for {props.assayType.name}</Typography>
            <ExperimentTable assayFilter={(experimentInfo : ExperimentInfo) => experimentInfo.assays.filter((assay) => assay.typeId === props.assayType.id)}/>
        </Container>
    )
}