import { Box, Button, Container, IconButton, Stack } from "@mui/material";
import {
    GridColDef,
    GridRowSelectionModel,
    GridSortModel,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import ExperimentCreationDialog from "@/components/experiment-list/experiment-creation-dialog";
import Layout from "../../components/shared/layout";
import SearchBar from "../../components/shared/search-bar";
import Table from "../../components/shared/table";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ViewIcon from "@mui/icons-material/Visibility";
import {
    fetchExperimentList,
    queryExperimentList,
} from "@/lib/controllers/experimentController";
import { getNumWeeksAfterStartDate } from "@/lib/datesUtils";
import { Experiment } from "@prisma/client";

interface ExperimentData {
    id: number;
    title: string;
    startDate: Date;
    week: number;
}

const getExperiments = async (query?: string): Promise<ExperimentData[]> => {
    let experimentList: Experiment[] = [];
    try {
        if (query && query.trim() !== "") {
            experimentList = await queryExperimentList(query);
        } else {
            experimentList = await fetchExperimentList();
        }
    } catch (error) {
        alert(error);
    }
    const experimentData: ExperimentData[] = experimentList.map(
        (experiment) => ({
            id: experiment.id,
            title: experiment.title,
            startDate: experiment.start_date,
            week: getNumWeeksAfterStartDate(experiment.start_date, new Date()),
        })
    );
    return experimentData;
};

const ExperimentList: React.FC = () => {
    const [experimentData, setExperimentData] = useState<ExperimentData[]>([]);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [showExperiementCreationDialog, setShowExperimentCreationDialog] =
        useState<boolean>(false);

    useEffect(() => {
        fetchAndSetData();
    }, [sortModel, showExperiementCreationDialog]);

    const fetchAndSetData = async () => {
        const fetchedData: ExperimentData[] = await getExperiments();
        setExperimentData(fetchedData);
    };

    const queryAndSetData = async (query: string) => {
        const queriedData: ExperimentData[] = await getExperiments(query);
        setExperimentData(queriedData);
    };

    const handleAddExperiment = () => {
        setShowExperimentCreationDialog(true);
    };

    const handleView = (id: number) => {
        console.log("View");
    };

    const handleDelete = (id: number) => {
        const updatedData: ExperimentData[] = experimentData.filter(
            (exp) => exp.id !== id
        );
        setExperimentData(updatedData);
    };

    const handleCloseDialog = (reason: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        setShowExperimentCreationDialog(false);
        fetchAndSetData();
    };

    const createTableColumns = (): GridColDef[] => {
        const columns: GridColDef[] = [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                flex: 2,
                align: "left",
                headerAlign: "left",
                disableColumnMenu: true,
                editable: false,
                sortable: true,
            },
            {
                field: "title",
                headerName: "Title",
                type: "string",
                flex: 5,
                align: "left",
                headerAlign: "left",
                disableColumnMenu: true,
                editable: false,
                sortable: true,
            },
            {
                field: "startDate",
                headerName: "Start Date",
                type: "date",
                flex: 2,
                align: "left",
                headerAlign: "left",
                disableColumnMenu: true,
                editable: false,
                sortable: true,
            },
            {
                field: "week",
                headerName: "Week",
                type: "number",
                flex: 1,
                align: "left",
                headerAlign: "left",
                disableColumnMenu: true,
                editable: false,
                sortable: true,
            },
            {
                field: "actions",
                headerName: "Actions",
                flex: 2,
                align: "center",
                headerAlign: "center",
                disableColumnMenu: true,
                sortable: false,
                renderCell: () => (
                    <Box sx={{ display: "flex" }}>
                        <IconButton>
                            <ViewIcon />
                        </IconButton>
                        <IconButton>
                            <PictureAsPdfIcon />
                        </IconButton>
                    </Box>
                ),
            },
        ];
        columns[0].valueFormatter = (params: any) => String(params.value);
        return columns;
    };

    const handleDeleteExperiments = (selectedRows: GridRowSelectionModel) => {
        // TODO: Implement delete on database
        fetchAndSetData();
    };

    return (
        <Layout>
            <Stack spacing={2}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "left",
                        paddingRight: 3,
                    }}
                >
                    <Container sx={{ flex: 2, marginRight: "25%" }}>
                        <SearchBar
                            placeholder="Enter Keyword"
                            onSearch={queryAndSetData}
                        />
                    </Container>
                    <Button
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            flex: 1,
                            marginLeft: "auto",
                            textTransform: "none",
                        }}
                        onClick={handleAddExperiment}
                    >
                        Add Experiment
                    </Button>
                </Box>
                <Table
                    columns={createTableColumns()}
                    rows={experimentData}
                    pagination
                    onDeleteRows={(selectedRows: GridRowSelectionModel) =>
                        handleDeleteExperiments(selectedRows)
                    }
                    onSortModelChange={(sortModel: GridSortModel) =>
                        setSortModel(sortModel)
                    }
                />
                <ExperimentCreationDialog
                    open={showExperiementCreationDialog}
                    onClose={(reason: string) => handleCloseDialog(reason)}
                />
            </Stack>
        </Layout>
    );
};

ExperimentList.displayName = "ExperimentList";
export default ExperimentList;
