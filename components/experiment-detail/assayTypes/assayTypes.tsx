import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack, Typography, Container, IconButton, Box, Button } from "@mui/material";
import React, {useState} from "react";

import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import Delete from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@/components/shared/table";
import { useAllUsers } from "@/lib/hooks/useAllUsers";
import { UserSelector } from "@/components/shared/userSelector";
import { useMutationToCreateAssayType } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { EditableTableCell } from "./editableTableCell";
import { NameCell } from "./nameCell";
import { UnitsCell } from "./unitsCell";
import { TechnicianCell } from "./technicianCell";
import { DeleteAssayTypeIcon } from "./deleteAssayTypeIcon";

const colDefs: GridColDef[] = [

    {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 4,
        valueGetter : (params : any) => String(params.row.assayType.name),
        renderCell : (params : any) => <NameCell {...params.row}/>
            
    },
    {
        field: "technicianId",
        headerName: "Technician",
        type: "number",
        flex: 2,
        renderCell : (params) => <TechnicianCell {...params.row}/>
    },

    {
        field: "units",
        headerName: "Units",
        type: "string",
        valueGetter: (params) => params.row.assayType.units,
        flex: 2,
        renderCell : (params : any) => <UnitsCell {...params.row}/>
    },

    {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => <DeleteAssayTypeIcon {...params.row}/>
    },
];


export const AssayTypes : React.FC = () => {
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    const {data : users} = useAllUsers();
    const {mutate : addRow} = useMutationToCreateAssayType();

    if (!experimentInfo){
        return null;
    }

    return (
        <Container style={{backgroundColor : "white", marginTop : 8, marginBottom : 8}}>
            <Typography variant="h6" style={{marginBottom : 8, marginTop : 8}}>Assay Types</Typography>
            <Table columns={colDefs} rows={experimentInfo.assayTypes} footer={() => <Button variant="contained" color="primary" onClick={() => addRow(experimentId)}>Add</Button>}/>
        </Container>
    );
}