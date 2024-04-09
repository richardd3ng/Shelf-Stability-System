import { getQueryKeyForUseExperimentInfo, useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack, Typography, Container, IconButton, Box, Button } from "@mui/material";
import React, {useContext, useState} from "react";

import { ExperimentInfo } from "@/lib/controllers/types";
import { useQueryClient } from "@tanstack/react-query";
import { createNewCustomAssayTypeForExperimentThroughAPI } from "@/lib/controllers/assayTypeController";
import AssayTypeCreationContext from "@/lib/context/experimentDetailPage/assayTypeCreationContext";
import { CreateAssayTypeModal } from "./createAssayTypeModal";




export const AssayTypesTableFooter : React.FC = () => {
    const experimentId = useExperimentId();
    const queryClient = useQueryClient();
    const {isCreating, setIsCreating} = useContext(AssayTypeCreationContext);

    return (
        <Stack direction="row" gap={2}>
            
            <Button variant="contained" color="primary" style={{textTransform : "none"}} onClick={async () => {
                //await createNewCustomAssayTypeForExperimentThroughAPI(experimentId);
                //queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
                setIsCreating(true);
            }}>+ Custom Type</Button>
            <CreateAssayTypeModal/>
        </Stack>
    );
}