import { useExperimentInfo } from "@/lib/hooks/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/useExperimentId";
import { Accordion, Container, Typography, AccordionSummary, AccordionDetails } from "@mui/material";
import React from "react";
import { LoadingContainer } from "../shared/loading";
import { ErrorMessage } from "../shared/errorMessage";
import { ExperimentTable } from "./experimentTable/experimentTable";
import { ExperimentInfo } from "@/lib/controllers/types";
import { ExpandMore } from "@mui/icons-material";
import { AssayResultInCell } from "./experimentTable/assayResultInCell";

export const AssaysGroupedByType : React.FC = () => {
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId);
    if (isLoading){
        return <LoadingContainer/>
    } else if (isError || !data){
        return <ErrorMessage message={"An error occurred"}/>
    } else {
        return (
            <Container style={{marginTop : 24}}>
                <Accordion >
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography>All Assays</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ExperimentTable assayFilter={(experimentInfo : ExperimentInfo) => experimentInfo.assays} componentForAssay={AssayButtonInCell}/>
                    </AccordionDetails>
                </Accordion>
                {data.assayTypes.map((type) => {
                    return (
                        <Accordion key={type.name}>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                <Typography>Assays Results for Type {type.id}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ExperimentTable assayFilter={(experimentInfo : ExperimentInfo) => experimentInfo.assays.filter((assay) => assay.typeId === type.id)} componentForAssay={AssayResultInCell}/>
                            </AccordionDetails>
                        </Accordion>
                    )
                    
                })}
            </Container>
        )
    }
    
}
