import React, {useState} from "react";
import { AssayTypeInfo, UserInfo } from "@/lib/controllers/types";
import { UserSelector } from "@/components/shared/userSelector";
import { useMutationToUpdateTechnicianOfAssayTypeForExperiment } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useAllUsers } from "@/lib/hooks/useAllUsers";
import { Stack } from "@mui/material";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { InitialTextDisplay } from "./initialTextDisplay";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import Edit from "@mui/icons-material/Edit";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";

export const TechnicianCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    const {data : users} = useAllUsers();
    const {mutate : updateTechnician} = useMutationToUpdateTechnicianOfAssayTypeForExperiment();
    const {isLoggedIn, isAdmin} = useUserInfo();
    if (isEditing){
        return (
            <UserSelector userId={props.technicianId ? props.technicianId : -1} includeNoneOption={true} setUserId={async (uid : number | null) => {
                await updateTechnician({
                    assayTypeForExperimentId : props.id,
                    technicianId : uid
                });
                setIsEditing(false);
            }}/>
        )
    } else if (users) {
        let technicianName : string | null = null;
        const correspondingTechnician = users.find((user : UserInfo) => user.id === props.technicianId);
        if (correspondingTechnician){
            technicianName = correspondingTechnician.displayName;
        }
        if (isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled){
            return (
                <Stack direction="row">
                    <InitialTextDisplay text={technicianName} nullDescription="None"/>
                    {
                        isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled
                        ?
                        <IconButtonWithTooltip
                            text="Edit"
                            icon={Edit}
                            onClick={() => setIsEditing(true)}
                        />
                        :
                        null
                    }

                </Stack>
            )
        } else {
            return (
                <InitialTextDisplay text={technicianName} nullDescription="None"/>
            )
        }
        
    } else {
        return null;
    }
}