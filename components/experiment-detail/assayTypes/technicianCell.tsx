import React, {useState} from "react";
import { AssayTypeInfo, UserInfo } from "@/lib/controllers/types";
import { UserSelector } from "@/components/shared/userSelector";
import { useMutationToUpdateTechnicianOfAssayTypeForExperiment } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useAllUsers } from "@/lib/hooks/useAllUsers";
import { Typography, Button } from "@mui/material";

export const TechnicianCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const {data : users} = useAllUsers();
    const {mutate : updateTechnician} = useMutationToUpdateTechnicianOfAssayTypeForExperiment();
    if (isEditing){
        return (
            <UserSelector userId={props.technicianId ? props.technicianId : -1} setUserId={async (uid : number) => {
                await updateTechnician({
                    assayTypeForExperimentId : props.id,
                    technicianId : uid
                });
                setIsEditing(false);
            }}/>
        )
    } else if (users) {
        let technicianName = "None";
        const correspondingTechnician = users.find((user : UserInfo) => user.id === props.technicianId);
        if (correspondingTechnician){
            technicianName = correspondingTechnician.displayName;
        }
        return (
            <Button style={{textTransform : "none"}}>
                <Typography onClick={() => setIsEditing(true)}>
                    {technicianName}
                </Typography>
            </Button>
        )
    } else {
        return null;
    }
}