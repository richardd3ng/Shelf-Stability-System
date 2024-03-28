import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Typography, Container, Button } from "@mui/material";
import React from "react";

import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import Table from "@/components/shared/table";
import { useAllUsers } from "@/lib/hooks/useAllUsers";
import { useMutationToCreateCustomAssayType } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { NameCell } from "./nameCell";
import { UnitsCell } from "./unitsCell";
import { TechnicianCell } from "./technicianCell";
import { DeleteAssayTypeIcon } from "./deleteAssayTypeIcon";
import { AssayTypesTableFooter } from "./tableFooter";
import { DescriptionCell } from "./descriptionCell";
import { useUserInfo } from "@/lib/hooks/useUserInfo";

const colDefs: GridColDef[] = [
    {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 2,
        valueGetter: (params: any) => String(params.row.assayType.name),
        renderCell: (params: any) => <NameCell {...params.row} />,
    },
    {
        field : "isCustom",
        headerName : "Custom Type?",
        type : "string",
        flex : 2,
        valueGetter : (params : any) => (params.row.assayType.isCustom ? "Yes" : "No")
    },
    {
        field: "technicianId",
        headerName: "Technician",
        type: "number",
        flex: 2,
        renderCell: (params) => <TechnicianCell {...params.row} />,
    },
    {
        field : "description",
        headerName : "Description",
        type : "string", 
        flex : 2,
        renderCell : (params) => <DescriptionCell {...params.row}/>
    },

    {
        field: "units",
        headerName: "Units",
        type: "string",
        valueGetter: (params) => params.row.assayType.units,
        flex: 2,
        renderCell: (params: any) => <UnitsCell {...params.row} />,
    },

    {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => <DeleteAssayTypeIcon {...params.row} />,
    },
];

export const AssayTypes: React.FC = () => {
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    const {isAdmin} = useUserInfo();
    
    let canAddTypes = isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled;
    if (!experimentInfo) {
        return null;
    }


    console.log("rendering assay types");
    return (
        <Container style={{backgroundColor : "white", marginTop : 8, marginBottom : 8}}>
            <Typography variant="h6" style={{marginBottom : 8, marginTop : 8}}>Assay Types</Typography>
            {
                canAddTypes 
                ?
                <Table columns={colDefs} rows={experimentInfo.assayTypes} footer={AssayTypesTableFooter}/>
                :
                <Table columns={colDefs} rows={experimentInfo.assayTypes} />

            }
            
        </Container>
    );
};
