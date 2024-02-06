import { Box, Button, Container, IconButton, Stack } from "@mui/material";
import {
    GridColDef,
    GridRowId,
    GridRowSelectionModel,
    GridSortModel,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ExperimentCreationDialog from "@/components/experiment-list/experiment-creation-dialog";
import Layout from "../../components/shared/layout";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchBar from "../../components/shared/search-bar";
import Table from "../../components/shared/table";
import ViewIcon from "@mui/icons-material/Visibility";
import { LoadingContainer } from "@/components/shared/loading";
import { getNumWeeksAfterStartDate } from "@/lib/datesUtils";
import {
    deleteExperiment,
    fetchExperimentList,
    hasRecordedAssayResults,
    queryExperimentList,
} from "@/lib/controllers/experimentController";
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
    const [loadingExperiments, setLoadingExperiments] =
        useState<boolean>(false);
    const [debounce, setDebounce] = useState<boolean>(false);

    useEffect(() => {
        fetchAndSetData();
    }, [sortModel, showExperiementCreationDialog]);

    const fetchAndSetData = async () => {
        setLoadingExperiments(true);
        const fetchedData: ExperimentData[] = await getExperiments();
        setExperimentData(fetchedData);
        setLoadingExperiments(false);
    };

    const queryAndSetData = async (query: string) => {
        if (debounce) {
            return;
        }
        setDebounce(true);
        const queriedData: ExperimentData[] = await getExperiments(query);
        setExperimentData(queriedData);
        setDebounce(false);
    };

    const handleAddExperiment = () => {
        setShowExperimentCreationDialog(true);
    };

    const handleView = (id: number) => {
        console.log("View");
    };

    const handleCloseDialog = async () => {
        setShowExperimentCreationDialog(false);
        await fetchAndSetData();
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
                renderCell: (params) => (
                    <Box sx={{ display: "flex" }}>
                        <IconButton>
                            <ViewIcon />
                        </IconButton>
                        <IconButton>
                            <PictureAsPdfIcon />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                handleDeleteExperiments([params.row.id])
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ),
            },
        ];
        columns[0].valueFormatter = (params: any) => String(params.value);
        return columns;
    };

    const handleDeleteExperiments = async (
        selectedRows: GridRowSelectionModel
    ) => {
        if (debounce) {
            return;
        }
        setDebounce(true);
        let deletedIds: number[] = [];
        let cannotDeleteIds: number[] = [];
        try {
            const deletePromises = selectedRows.map(
                async (experimentId: GridRowId) => {
                    experimentId = experimentId as number;
                    try {
                        const resultFound: Boolean =
                            await hasRecordedAssayResults(experimentId);
                        if (resultFound) {
                            cannotDeleteIds.push(experimentId);
                        } else {
                            await deleteExperiment(experimentId);
                            deletedIds.push(experimentId);
                        }
                    } catch (error) {
                        alert(error);
                    }
                }
            );
            await Promise.all(deletePromises);
            if (deletedIds.length > 0) {
                alert(
                    `The following experiments were successfully deleted: ${deletedIds.join(
                        ", "
                    )}`
                );
            }
            if (cannotDeleteIds.length > 0) {
                alert(
                    `The following experiments contained recorded assay results and could not be deleted: ${cannotDeleteIds.join(
                        ", "
                    )}`
                );
            }
            await fetchAndSetData();
        } catch (error) {
            alert(error);
        }
        setDebounce(false);
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
                {loadingExperiments ? (
                    <LoadingContainer text="Loading Experiments..." />
                ) : (
                    <Table
                        columns={createTableColumns()}
                        rows={experimentData}
                        pagination
                        onDeleteRows={handleDeleteExperiments}
                        onSortModelChange={setSortModel}
                    />
                )}
                <ExperimentCreationDialog
                    open={showExperiementCreationDialog}
                    onClose={handleCloseDialog}
                />
            </Stack>
        </Layout>
    );
};

ExperimentList.displayName = "ExperimentList";
export default ExperimentList;
