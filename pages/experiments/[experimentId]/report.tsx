
import { ExperimentInfo } from "@/lib/controllers/types";
import { ExperimentTable } from "@/components/experiment-detail/experimentTable/experimentTable";
import { AssaysGroupedByType } from "@/components/experiment-detail/assaysGroupedByType";
import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";
import { useState } from "react";
import { AssayEditorModal } from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import { AssayButtonInCell } from "@/components/experiment-detail/experimentTable/assayButtonInCell";
import { ExperimentHeader } from "@/components/experiment-detail/summary/experimentHeader";
import { Container } from "@mui/material";


export default function ExperimentPage() {
    const [isEditingAssay, setIsEditingAssay] = useState<boolean>(false);
    const [assayIdBeingEdited, setAssayIdBeingEdited] = useState<number>(0);
    return (
        <Container>
            <AssayEditingContext.Provider value={{isEditing : isEditingAssay, setIsEditing : setIsEditingAssay, assayIdBeingEdited, setAssayIdBeingEdited}}>
                <ExperimentHeader/>
                <ExperimentTable assayFilter={(experiment : ExperimentInfo) => experiment.assays} componentForAssay={AssayButtonInCell}/>
                <AssayEditorModal/>
                <AssaysGroupedByType/>
            </AssayEditingContext.Provider>
        </Container>
    )
    
}