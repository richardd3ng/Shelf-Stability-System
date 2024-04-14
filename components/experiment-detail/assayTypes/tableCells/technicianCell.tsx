import React, {useState} from "react";
import { AssayTypeInfo, UserInfo } from "@/lib/controllers/types";
import { useAllUsers } from "@/lib/hooks/useAllUsers";
import { InitialTextDisplay } from "./initialTextDisplay";

export const TechnicianCell : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {data : users} = useAllUsers();

    if (users) {
        
        let technicianName : string | null = null;
        const correspondingTechnician = users.find((user : UserInfo) => user.id === props.technicianId);
        if (correspondingTechnician){
            technicianName = correspondingTechnician.displayName + " (" + correspondingTechnician.username + ")";
        }
        return (
            <InitialTextDisplay text={technicianName} nullDescription="None"/>
        )
        
    } else {
        return null;
    }
}