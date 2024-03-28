import { useAllUsers } from "@/lib/hooks/useAllUsers"
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ExperimentInfo, UserInfo } from "@/lib/controllers/types";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useAllStandardAssayTypes } from "@/lib/hooks/useAllStandardAssayTypes";
import { useState, useEffect } from "react";
import { AssayType } from "@prisma/client";

interface StandardAssayTypesSelector {
    assayTypeId : number;
    setAssayTypeId : (n : number) => void;

}
export const StandardAssayTypesSelector : React.FC<StandardAssayTypesSelector> = (props : StandardAssayTypesSelector) => {

    //const {data : experimentInfo} = useExperimentInfo(experimentId);
    const {data : standardAssayTypes} = useAllStandardAssayTypes();

    if (!standardAssayTypes){
        return null;
    }
    
    return (
        <FormControl fullWidth>
            <InputLabel id="Assay Type" required>
                Assay Type
            </InputLabel>
            <Select
                id="Assay Type"
                value={props.assayTypeId}
                label="Assay Type"
                onChange={(e) => {
                    props.setAssayTypeId(Number(e.target.value))
                }}
            >

                {standardAssayTypes.map((type: AssayType) => (
                    <MenuItem key={type.id} value={type.id}>
                        {type.name}
                    </MenuItem>
                ))}

            </Select>
        </FormControl>
    )
}
