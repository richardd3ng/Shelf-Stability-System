import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Typography, Container, } from "@mui/material";
import React, {useState} from "react";

import { GridColDef } from "@mui/x-data-grid";
import Table from "@/components/shared/table";
import { NameCell } from "./tableCells/nameCell";
import { UnitsCell } from "./tableCells/unitsCell";
import { TechnicianCell } from "./tableCells/technicianCell";
import { AssayTypesTableFooter } from "./tableFooter";
import { DescriptionCell } from "./tableCells/descriptionCell";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import AssayTypeCreationContext from "@/lib/context/experimentDetailPage/assayTypeCreationContext";
import { ActionsBox } from "./actionsBox/actionsBox";
import AssayTypeEditingContext from "@/lib/context/experimentDetailPage/assayTypeEditingContext";
import { EditAssayTypeModal } from "./editAssayTypeModal";


const allColDefs: GridColDef[] = [
    {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 2,
        valueGetter: (params: any) => String(params.row.assayType.name),
        renderCell: (params: any) => <NameCell {...params.row} />,
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
        field: "technicianId",
        headerName: "Technician",
        type: "number",
        flex: 2,
        renderCell: (params) => <TechnicianCell {...params.row} />,
    },

    {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => <ActionsBox {...params.row}/>, 
    },
];



export const AssayTypes: React.FC = () => {
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    const {isAdmin} = useUserInfo();

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [nameBeingEdited, setNameBeingEdited] = useState<string>("");
    const [descriptionBeingEdited, setDescriptionBeingEdited] = useState<string | null>(null);
    const [unitsBeingEdited, setUnitsBeingEdited] = useState<string | null>(null);
    const [technicianIdBeingEdited, setTechnicianIdBeingEdited] = useState<number | null>(null);
    const [assayTypeIdBeingEdited, setAssayTypeIdBeingEdited] = useState<number>(-1);

    let canAddTypes = isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled;
    if (!experimentInfo) {
        return null;
    }
    let colDefs = allColDefs;
    if (!isAdmin){
        colDefs = colDefs.filter((column) => column.field !== "actions");
    }
    return (
        <AssayTypeCreationContext.Provider value={{isCreating : isCreating, setIsCreating : setIsCreating}}>
            <AssayTypeEditingContext.Provider value={{isEditing, setIsEditing, assayTypeIdBeingEdited, setAssayTypeIdBeingEdited, name : nameBeingEdited, setName : setNameBeingEdited, 
                units : unitsBeingEdited, setUnits : setUnitsBeingEdited, description : descriptionBeingEdited, setDescription : setDescriptionBeingEdited, technicianId : technicianIdBeingEdited,
                setTechnicianId : setTechnicianIdBeingEdited}}
            >
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
                <EditAssayTypeModal/>
            </AssayTypeEditingContext.Provider>
        </AssayTypeCreationContext.Provider>
    );
};
