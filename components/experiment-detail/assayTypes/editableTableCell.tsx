import { Stack, TextField, } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import React, {useState, useEffect} from "react";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { InitialTextDisplay } from "./initialTextDisplay";
import { SaveOrCancelOptions } from "./saveOrCancelOptions";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { AssayTypeInfo } from "@/lib/controllers/types";
import { checkIfThereAreRecordedResultsForAssayType } from "@/lib/controllers/assayTypeController";

interface EditableTableCellProps {
    initialText : string | null;
    saveText : (s : string) => void;
    onlyAdminCanEdit : boolean;
    nullDescription : string;
    assayType : AssayTypeInfo;
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
    let canEdit = props.assayType && props.assayType.assayType.isCustom && isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled && !checkIfThereAreRecordedResultsForAssayType(props.assayType.id, experimentInfo);

    
    let submitData = () => {
        if (cellValue){
            props.saveText(cellValue);
        }
        
        setIsEditing(false);
    }

    if (isEditing){
        return (
            <Stack direction="row">
                <form onSubmit={submitData}>
                    <TextField value={cellValue} onChange={(e) => setCellValue(e.target.value)} type="text"/>

                    <SaveOrCancelOptions onSave={submitData} onCancel={() => {
                            setCellValue(props.initialText);
                            setIsEditing(false);
                        }}
                    />
                </form>
            </Stack>
            
        )
    } else {
        if (!canEdit){
            return (
                <InitialTextDisplay text={cellValue} nullDescription={props.nullDescription}/>
            )
        } else {
            return (
                <Stack direction="row">
                    <InitialTextDisplay text={cellValue} nullDescription={props.nullDescription}/>
                    {
                        canEdit ?
                        <IconButtonWithTooltip
                            text="Edit"
                            icon={Edit}
                            onClick={() => setIsEditing(true)}
                        />
                        :
                        null

                    }
                    
                </Stack >
            )
        }

        
    }

    
}

