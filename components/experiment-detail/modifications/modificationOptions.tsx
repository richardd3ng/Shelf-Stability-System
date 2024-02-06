import React, { useState, useContext } from "react";
import { Stack , Typography, Button} from "@mui/material";
import { ExperimentAdditionsContext } from "@/lib/context/experimentDetailPage/experimentAdditionsContext";
import { NewConditionModal } from "./newEntityModals/newConditionModal";
import { NewAssayTypeModal } from "./newEntityModals/newAssayTypeModal";
import { NewAssayModal } from "./newEntityModals/newAssayModal";
interface ModButtonProps {
    text : string;
    onClick : () => void;
}
const ModButton : React.FC<ModButtonProps> = (props : ModButtonProps) => {
    return (
        <Button style={{textTransform : "none", marginLeft : 8, marginRight : 8}} variant="outlined" onClick={props.onClick}>
            <Typography>{props.text}</Typography>
        </Button>
    )
}
export const ModificationOptions  = () => {
    const [isAddingCondition, setIsAddingCondition] = useState<boolean>(false);
    const [isAddingAssayType, setIsAddingAssayType] = useState<boolean>(false);
    const [isAddingAssay, setIsAddingAssay] = useState<boolean>(false);
    const options : ModButtonProps[] = [
        {text : "Add an Assay type", onClick : () => {setIsAddingAssayType(true)}},
        {text : "Add a Condition", onClick : () => {setIsAddingCondition(true)}},
        {text : "Add an Assay", onClick : () => {setIsAddingAssay(true)}}
    ];
    return (
        <ExperimentAdditionsContext.Provider value={{isAddingCondition, setIsAddingCondition, isAddingAssayType, setIsAddingAssayType, isAddingAssay, setIsAddingAssay}}>
            <Stack direction="row">
                <Typography>Options : </Typography>
                {options.map((option, index) => <ModButton text={option.text} onClick={option.onClick} key={index}/>)}
            </Stack>
            <NewConditionModal/>
            <NewAssayTypeModal/>
            <NewAssayModal/>
        </ExperimentAdditionsContext.Provider>
    );
}