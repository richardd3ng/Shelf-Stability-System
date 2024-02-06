import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId"
import { Stack, Button, Typography } from "@mui/material";
import { ConditionEditingContext } from "@/lib/context/experimentDetailPage/conditionEditingContext";
import React, {useContext, useState} from "react";
import { MoreVert } from "@mui/icons-material";
import { ConditionEditorModal } from "../modifications/editorModals/conditionEditorModal";
import { ButtonInSummaryRow } from "./buttonInSummaryRow";


export const ConditionsSummary = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [conditionIdBeingEdited, setConditionIdBeingEdited] = useState<number>(-1);
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId);
    if (data){
        return (
            <ConditionEditingContext.Provider value={{isEditing, setIsEditing, conditionIdBeingEdited, setConditionIdBeingEdited}}>
                <Stack direction="row">
                    <Typography>Conditions: </Typography>
                    {data.conditions.map((condition) => <ButtonInSummaryRow key={condition.id} text={condition.name} onClick={() => {
                        setConditionIdBeingEdited(condition.id);
                        setIsEditing(true);
                    }}/>)}
                </Stack>
                <ConditionEditorModal/>
            </ConditionEditingContext.Provider>
        )
    } else {
        return null;
    }
}
