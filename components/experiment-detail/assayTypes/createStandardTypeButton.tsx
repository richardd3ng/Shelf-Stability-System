import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack, Typography, Container, IconButton, Box, Button } from "@mui/material";
import React, {useEffect, useState} from "react";
import { useMutationToCreateCustomAssayType, useMutationToCreateStandardAssayType } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { SaveOrCancelOptions } from "./saveOrCancelOptions";
import { StandardAssayTypesSelector } from "./standardAssayTypesSelector";



export const CreateStandardAssayTypeButton : React.FC = () => {
    const experimentId = useExperimentId();
    //const {mutate : addRow} = useMutationToCreateStandardAssayType();
    const addRow = (x : any) => {};
    const [isChoosing, setIsChoosing] = useState<boolean>(false);
    const [chosenAssayTypeId, setChosenAssayTypeId] = useState<number>(-1);
    

    if (true){
        return (
            <Stack direction="row">
                

                <Button variant="contained" color="primary" style={{textTransform : "none"}} onClick={() => setIsChoosing(true)}>+ Add Standard Type</Button>
                <StandardAssayTypesSelector assayTypeId={chosenAssayTypeId} setAssayTypeId={(id : number) => setChosenAssayTypeId(id)}/>
                           
                <SaveOrCancelOptions onSave={async () => {
                    if (chosenAssayTypeId >= 0){
                        await addRow({experimentId : experimentId, assayTypeId : chosenAssayTypeId});
                        setIsChoosing(false);
                    }
                }} onCancel={() => {
                    setIsChoosing(false);
                }}/>
            </Stack>
        )
    } else {
        return (
            <Button variant="contained" color="primary" style={{textTransform : "none"}} onClick={() => setIsChoosing(true)}>+ Add Standard Type</Button>
        );
    }
    
}