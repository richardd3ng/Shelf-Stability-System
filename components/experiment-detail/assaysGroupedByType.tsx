import { useExperimentInfo } from "@/lib/hooks/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/useExperimentId";
import { Container } from "@mui/material";
import React from "react";
import { LoadingContainer } from "../shared/loading";
import { ErrorMessage } from "../shared/errorMessage";
import { AssaysOfOneType } from "./assaysOfOneType";



export const AssaysGroupedByType : React.FC = () => {
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId);
    if (isLoading){
        return <LoadingContainer/>
    } else if (isError || !data){
        return <ErrorMessage message={"An error occurred"}/>
    } else {
        return (
            <Container>
                {data.assayTypes.map((type) => <AssaysOfOneType assayType={type} experimentId={experimentId} key={type.id}/>)}
            </Container>
        )
    }
    
}