import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId"
import { Stack, Typography } from "@mui/material";
import { AssayTypeEditingContext } from "@/lib/context/experimentDetailPage/assayTypeEditingContext";
import React, {useState} from "react";
import { AssayTypeEditorModal } from "../modifications/editorModals/assayTypeEditorModal";
import { ButtonInSummaryRow } from "./buttonInSummaryRow";


export const AssayTypesSummary = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [assayTypeIdBeingEdited, setAssayTypeIdBeingEdited] = useState<number>(-1);
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId);
    if (data){
        return (
            <AssayTypeEditingContext.Provider value={{isEditing, setIsEditing, assayTypeIdBeingEdited, setAssayTypeIdBeingEdited}}>
                <Stack direction="row">
                    <Typography>AssayTypes: </Typography>
                    {data.assayTypes.map((assayType) => <ButtonInSummaryRow key={assayType.id} text={assayType.name} onClick={
                        () => {
                            setIsEditing(true);
                            setAssayTypeIdBeingEdited(assayType.id);
                        }   
                    }/>)}
                </Stack>
                <AssayTypeEditorModal/>
            </AssayTypeEditingContext.Provider>
        )
    } else {
        return null;
    }
}
