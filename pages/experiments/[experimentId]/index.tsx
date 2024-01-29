
import { ExperimentInfo } from "@/lib/controllers/types";
import { useExperimentId } from "@/lib/hooks/useExperimentId";
import {Typography, Container} from "@mui/material";
import { ExperimentTable } from "@/components/experiment-detail/experimentTable";
import { AssaysGroupedByType } from "@/components/experiment-detail/assaysGroupedByType";
import Layout from "@/components/shared/layout";
import { AssayEditingContext } from "@/lib/context/assayEditingContext";
import { useState } from "react";
import { AssayEditorModal } from "@/components/experiment-detail/assayEditorModal";

export default function ExperimentPage() {
    const experimentId = useExperimentId();
    const [isEditingAssay, setIsEditingAssay] = useState<boolean>(false);
    const [assayIdBeingEdited, setAssayIdBeingEdited] = useState<number>(0);
    return (
        <Layout>
            <AssayEditingContext.Provider value={{isEditing : isEditingAssay, setIsEditing : setIsEditingAssay, assayIdBeingEdited, setAssayIdBeingEdited}}>
                <Typography>Hi these are experiment details for {experimentId}</Typography>
                <ExperimentTable assayFilter={(experiment : ExperimentInfo) => experiment.assays}/>
                <AssayEditorModal/>
                <AssaysGroupedByType/>
            </AssayEditingContext.Provider>
        </Layout>
    )
    
}