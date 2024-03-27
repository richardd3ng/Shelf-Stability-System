import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Typography, Container, Button } from "@mui/material";
import React from "react";

import { GridColDef } from "@mui/x-data-grid";
import Table from "@/components/shared/table";
import { useMutationToCreateAssayType } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
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
        valueGetter: (params: any) => String(params.row.assayType.name),
        renderCell: (params: any) => <NameCell {...params.row} />,
    },
    {
        field: "technicianId",
        headerName: "Technician",
        type: "number",
        flex: 2,
        renderCell: (params) => <TechnicianCell {...params.row} />,
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
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const { mutate: addRow } = useMutationToCreateAssayType();

    if (!experimentInfo) {
        return null;
    }

    return (
        <Container
            style={{ backgroundColor: "white", marginTop: 8, marginBottom: 8 }}
        >
            <Typography variant="h6" style={{ marginBottom: 8, marginTop: 8 }}>
                Assay Types
            </Typography>
            <Table
                columns={colDefs}
                rows={experimentInfo.assayTypes}
                footer={() => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addRow(experimentId)}
                        sx={{ textTransform: "none" }}
                    >
                        + Type
                    </Button>
                )}
            />
        </Container>
    );
};
