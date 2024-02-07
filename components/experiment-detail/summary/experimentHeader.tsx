import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId"
import { Container, Typography, Stack, IconButton, Button } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { ConditionsSummary } from "./conditionsSummary";
import { AssayTypesSummary } from "./assayTypesSummary";
import { useRouter } from "next/router";
import { ExperimentEditorModal } from "../modifications/editorModals/experimentEditorModal";
import { ExperimentEditingContext } from "@/lib/context/experimentDetailPage/experimentEditingContext";
import { useContext, useState } from "react";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const router = useRouter();
    const [isEditingExperimentMetadata, setIsEditingExperimentMetadata] = useState<boolean>(false);
    return (
        <Container >
            <Typography align="center" variant="h3" style={{marginBottom : 8, marginTop : 8}}>Experiment {experimentId}</Typography>
            {data 
                ?
                <>  
                    <ExperimentEditingContext.Provider value={{isEditing : isEditingExperimentMetadata, setIsEditing : setIsEditingExperimentMetadata}}>
                        <Container style={{marginTop : 16, marginBottom : 16, border : "1px black solid"}}>
                            
                            <Typography align="center" variant="h4" style={{marginBottom : 8, marginTop : 8}}>Title: {data ? data.experiment.title : null}</Typography>
                            <Typography align="center" variant="h5" style={{marginBottom : 8}}>Description: {data ? data.experiment.description : null}</Typography>
                            <Typography align="center" variant="h5" style={{marginBottom : 8}}>Start Date : {data ? data.experiment.start_date.toLocaleDateString() : null}</Typography>
                            {router.pathname.endsWith("report") 
                                ? 
                                null 
                                : 
                                <>
                                    <Button variant="contained" color="primary" style={{marginTop : -32}} onClick={() => setIsEditingExperimentMetadata(true)}>
                                        <Typography >
                                            Edit Metadata
                                        </Typography>
                                    </Button>
                                    <ExperimentEditorModal/>
                                </>
                            }
                            
                        </Container>
                    </ExperimentEditingContext.Provider>
                    <Stack gap={1}>
                        <ConditionsSummary/>
                        <AssayTypesSummary/>
                    </Stack>
                </>
                : 
                null
            }
            
        </Container>
        
    )
}
