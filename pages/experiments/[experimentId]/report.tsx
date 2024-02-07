
import { ExperimentInfo } from "@/lib/controllers/types";
import { ExperimentTable } from "@/components/experiment-detail/experimentTable/experimentTable";
import { AssaysGroupedByType } from "@/components/experiment-detail/assaysGroupedByType";
import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";
import { useState } from "react";
import { AssayEditorModal } from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import { AssayButtonInCell } from "@/components/experiment-detail/experimentTable/assayButtonInCell";
import { ExperimentHeader } from "@/components/experiment-detail/summary/experimentHeader";
import { Container, Typography } from "@mui/material";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { AssayResultInCell } from "@/components/experiment-detail/experimentTable/assayResultInCell";

export default function ExperimentPage() {
    const [isEditingAssay, setIsEditingAssay] = useState<boolean>(false);
    const [assayIdBeingEdited, setAssayIdBeingEdited] = useState<number>(0);
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    return (
        <Container>
                <ExperimentHeader/>
                <ExperimentTable assayFilter={(experiment : ExperimentInfo) => experiment.assays} componentForAssay={AssayButtonInCell}/>
                {data 
                    ? 
                    data.assayTypes.map((type) => {
                        return (
                            <Container key={type.id} style={{marginBottom : 24, marginTop : 64, border : "1px solid black"}}>
                                <Typography>Assays Results for Type {type.name}</Typography>
                                <ExperimentTable assayFilter={(experimentInfo : ExperimentInfo) => experimentInfo.assays.filter((assay) => assay.typeId === type.id)} componentForAssay={AssayResultInCell}/>

                            </Container>
                                                )
                        
                    })
                    : 
                    null
                }
        </Container>
    )
    
}