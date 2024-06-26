import { Stack,  Button } from "@mui/material";
import React, {useContext } from "react";

import AssayTypeCreationContext from "@/lib/context/experimentDetailPage/assayTypeCreationContext";
import { CreateAssayTypeModal } from "./createAssayTypeModal";


export const AssayTypesTableFooter : React.FC = () => {
    const { setIsCreating} = useContext(AssayTypeCreationContext);

    return (
        <Stack direction="row" gap={2}>
            
            <Button variant="contained" color="primary" style={{textTransform : "none"}} onClick={async () => {
                setIsCreating(true);
            }}>+ Custom Type</Button>
            <CreateAssayTypeModal/>
        </Stack>
    );
}