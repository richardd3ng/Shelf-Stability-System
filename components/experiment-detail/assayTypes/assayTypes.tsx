import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Stack, Typography, Container, IconButton, Box, Button } from "@mui/material";
import React, {useState} from "react";
import { AssayTypeChip } from "./assayTypeChip";
import AddIcon from "@mui/icons-material/Add";
import AssayTypeEditingContext from "@/lib/context/experimentDetailPage/assayTypeEditingContext";
import { INVALID_ASSAY_TYPE_ID } from "@/lib/api/apiHelpers";
import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import Delete from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@/components/shared/table";

const colDefs: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        type: "number",
        flex: 1.5,
        valueGetter: (params: any) => String(params.row.id),
    },
    {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 4,
        valueGetter : (params : any) => String(params.row.assayType.name)
    },
    {
        field: "technicianId",
        headerName: "Technician",
        type: "number",
        flex: 2,
    },
    {
        field : "isCustom",
        headerName : "Custom?",
        type : "string",
        flex : 2,
        valueGetter : (params : any) => String(params.row.assayType.isCustom)
    },
    {
        field: "units",
        headerName: "Units",
        type: "string",
        valueGetter: (params) => params.row.assayType.units,
        flex: 2,
    },

    {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: "flex" }}>

                <IconButtonWithTooltip
                    text="Delete"
                    icon={Delete}
                    onClick={() => {}}
                ></IconButtonWithTooltip>
                <IconButton
                    size="small"
                    onClick={() => {}}
                >
                    <EditIcon
                        sx={{ fontSize: 20, color: "gray" }}
                    />
                </IconButton>
            </Box>
        ),
    },
];


export const AssayTypes : React.FC = () => {
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);

    if (!experimentInfo){
        return null;
    }

    return (
        <Container style={{backgroundColor : "white", marginTop : 8, marginBottom : 8}}>
            <Typography variant="h6" style={{marginBottom : 8, marginTop : 8}}>Assay Types</Typography>
            <Table columns={colDefs} rows={experimentInfo.assayTypes} footer={() => <Button variant="contained" color="primary">Add</Button>}/>
        </Container>
    );
}