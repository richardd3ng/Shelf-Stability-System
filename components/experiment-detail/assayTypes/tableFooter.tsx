import { getQueryKeyForUseExperimentInfo, useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack, Typography, Container, IconButton, Box, Button } from "@mui/material";
import React, {useState} from "react";

import { ExperimentInfo } from "@/lib/controllers/types";
import { useQueryClient } from "@tanstack/react-query";
import { createNewCustomAssayTypeForExperimentThroughAPI } from "@/lib/controllers/assayTypeController";




export const AssayTypesTableFooter : React.FC = () => {
    const experimentId = useExperimentId();
    const queryClient = useQueryClient();

    return (
        <Stack direction="row" gap={2}>
            
            <Button variant="contained" color="primary" style={{textTransform : "none"}} onClick={async () => {
                await createNewCustomAssayTypeForExperimentThroughAPI(experimentId);
                queryClient.invalidateQueries({queryKey : getQueryKeyForUseExperimentInfo(experimentId)});
            }}>+ Add Custom Type</Button>
           
        </Stack>
    );
}