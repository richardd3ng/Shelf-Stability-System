import { Button, Stack, TextField, IconButton } from "@mui/material";
import Check from "@mui/icons-material/Check";
import { Cancel } from "@mui/icons-material";
import React, {useState, useEffect} from "react";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { InitialTextDisplay, TextDisplayWithHover } from "./initialTextDisplay";
import { SaveOrCancelOptions } from "./saveOrCancelOptions";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";

interface EditableTableCellProps {
    initialText : string | null;
    saveText : (s : string) => void;
    onlyAdminCanEdit : boolean;
    nullDescription : string;
}

export const EditableTableCell : React.FC<EditableTableCellProps> = (props : EditableTableCellProps) => {
    const [cellValue, setCellValue] = useState<string | null>("");
    const {isAdmin} = useUserInfo();
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    useEffect(() => {
        setCellValue(props.initialText);
    }, [props.initialText]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    let canEdit = true;
    let reasonCantEdit = "";
    if (experimentInfo && experimentInfo.experiment.isCanceled){
        canEdit = false;
        reasonCantEdit = "Can't edit because the experiment is canceled"
    }
    if (props.onlyAdminCanEdit && !isAdmin){
        canEdit = false;
        reasonCantEdit = "Must be an admin to edit";
    }


    if (isEditing){
        return (
            <Stack direction="row">
                <TextField value={cellValue} onChange={(e) => setCellValue(e.target.value)}>
    
                </TextField>
                <SaveOrCancelOptions onSave={() => {
                        if (cellValue){
                            props.saveText(cellValue);
                        }
                        
                        setIsEditing(false);
                    }} onCancel={() => {
                        setCellValue(props.initialText);
                        setIsEditing(false);
                    }}
                />
            </Stack>
            
        )
    } else {
        if (!canEdit){
            return (
                <InitialTextDisplay text={cellValue} nullDescription={props.nullDescription}/>
            )
        } else {
            return (
                <Button  onClick={() => setIsEditing(true)} style={{textTransform : "none"}}>
                    <InitialTextDisplay text={cellValue} nullDescription={props.nullDescription}/>
                </Button>
            )
        }

        
    }

    
}

