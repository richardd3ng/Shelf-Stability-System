
import { ExperimentInfo } from "@/lib/controllers/types";
import { ExperimentTable } from "@/components/experiment-detail/experimentTable/experimentTable";
import { AssaysGroupedByType } from "@/components/experiment-detail/assaysGroupedByType";
import Layout from "@/components/shared/layout";
import { AssayEditingContext } from "@/lib/context/assayEditingContext";
import { useState } from "react";
import { AssayEditorModal } from "@/components/experiment-detail/assayEditorModal";
import { AssayButtonInCell } from "@/components/experiment-detail/experimentTable/assayButtonInCell";
import { ExperimentHeader } from "@/components/experiment-detail/experimentHeader";
import { Container, Typography, Button } from "@mui/material";
import { useExperimentId } from "@/lib/hooks/useExperimentId";
import { useRouter } from "next/router";


export default function ExperimentPage() {
    const [isEditingAssay, setIsEditingAssay] = useState<boolean>(false);
    const [assayIdBeingEdited, setAssayIdBeingEdited] = useState<number>(0);
    const experimentId = useExperimentId();
    const router = useRouter();
    return (
        <Layout>
            <AssayEditingContext.Provider value={{isEditing : isEditingAssay, setIsEditing : setIsEditingAssay, assayIdBeingEdited, setAssayIdBeingEdited}}>
                <ExperimentHeader/>
                <ExperimentTable assayFilter={(experiment : ExperimentInfo) => experiment.assays} componentForAssay={AssayButtonInCell}/>
                <AssayEditorModal/>
                <AssaysGroupedByType/>
                <Container maxWidth="sm" style={{marginTop : 24, marginBottom : 24}}>
                    <Typography align="center">
                        <Button variant="outlined" onClick={() => router.push("/experiments/" + experimentId.toString() + "/report")} style={{textTransform : "none"}}>
                            <Typography align="center">
                                Generate a report for this experiment
                            </Typography> 
                        </Button>
                    </Typography>
                    
                </Container>
            </AssayEditingContext.Provider>
        </Layout>
    )
    
}