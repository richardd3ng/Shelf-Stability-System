import React, {useContext} from "react"
import Edit from "@mui/icons-material/Edit";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import { AssayTypeInfo } from "@/lib/controllers/types";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import AssayTypeEditingContext from "@/lib/context/experimentDetailPage/assayTypeEditingContext";

export const EditAssayTypeIcon : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {isAdmin } = useUserInfo();
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    let canEdit = isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled;
    const {setIsEditing, setAssayTypeIdBeingEdited, setName, setUnits, setDescription, setTechnicianId} = useContext(AssayTypeEditingContext);


    if (!canEdit){
        return null;
    }
    return (
        <>
            <IconButtonWithTooltip
                text="Edit"
                icon={Edit}
                onClick={() => {
                    setAssayTypeIdBeingEdited(props.id);
                    setName(props.assayType.name);
                    setUnits(props.assayType.units);
                    setDescription(props.assayType.description);
                    setTechnicianId(props.technicianId);
                    setIsEditing(true);
            
                }}
            />
            

        </>

    )
}