import {
    Alert,
    Box,
    Button,
    Container,
    IconButton,
    Stack,
} from "@mui/material";
import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import ExperimentCreationDialog from "@/components/experiment-list/experiment-creation-dialog";
import Layout from "../../components/shared/layout";
import SearchBar from "../../components/shared/search-bar";
import Table from "../../components/shared/table";
import ViewIcon from "@mui/icons-material/Visibility";
import { LoadingContainer } from "@/components/shared/loading";
import { getNumWeeksAfterStartDate } from "@/lib/datesUtils";
import {
    deleteExperiment,
    fetchExperimentList,
    hasRecordedAssayResults,
} from "@/lib/controllers/experimentController";
import ExperimentDeletionDialog from "@/components/experiment-list/experiment-deletion-dialog";
import { useAlert } from "@/lib/context/alert-context";
import {
    ServerPaginationArgs,
    useServerPagination,
} from "@/lib/hooks/useServerPagination";
import { ExperimentTable } from "@/lib/controllers/types";
import { useRouter } from "next/router";

interface ExperimentData {
    id: number;
    title: string;
    startDate: Date;
    week: number;
}

const ExperimentList: React.FC = () => {
    const [experimentData, setExperimentData] = useState<ExperimentData[]>([]);
    const [showCreationDialog, setShowCreationDialog] =
        useState<boolean>(false);
    const [showDeletionDialog, setShowDeletionDialog] =
        useState<boolean>(false);
    const [loadingExperiments, setLoadingExperiments] =
        useState<boolean>(false);
    const [debounce, setDebounce] = useState<boolean>(false);
    const [selectedExperimentIds, setSelectedExperimentIds] =
        useState<GridRowSelectionModel>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { showAlert } = useAlert();
    const router = useRouter();

    const colDefs: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "number",
            flex: 2,
            valueFormatter: (params: any) => String(params.value),
        },
        {
            field: "title",
            headerName: "Title",
            type: "string",
            flex: 5,
        },
        {
            field: "startDate",
            headerName: "Start Date",
            type: "date",
            flex: 2,
        },
        {
            field: "week",
            headerName: "Week",
            type: "number",
            flex: 1,
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
                    <IconButton onClick={() => handleView(params.row.id)}>
                        <ViewIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleGenerateReport(params.row.id)}
                    >
                        <DescriptionIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => prepareForDeletion([params.row.id])}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const getExperiments = (
        paging: ServerPaginationArgs
    ): Promise<{ rows: ExperimentData[]; rowCount: number }> => {
        return fetchExperimentList(searchQuery, paging)
            .catch((error) => {
                showAlert("error", String(error));
                return { rows: [], rowCount: 0 };
            })
            .then((table: ExperimentTable) => ({
                rows: table.rows.map((experiment) => ({
                    id: experiment.id,
                    title: experiment.title,
                    startDate: experiment.startDate,
                    week: getNumWeeksAfterStartDate(
                        experiment.startDate,
                        new Date()
                    ),
                })),
                rowCount: table.rowCount,
            }));
    };

    const reloadExperimentData = (
        paging: ServerPaginationArgs
    ): Promise<{ rows: ExperimentData[]; rowCount: number }> => {
        setLoadingExperiments(true);
        return getExperiments(paging).then((fetchedData) => {
            setExperimentData(fetchedData.rows);
            setLoadingExperiments(false);
            return fetchedData;
        });
    };

    const [paginationProps, reload] = useServerPagination(
        reloadExperimentData,
        [],
        {
            pageSize: 10,
            page: 0,
        }
    );

    useEffect(() => {
        if (debounce) {
            return;
        }
        setDebounce(true);
        reload();
        setDebounce(false);
    }, [searchQuery]);

    const handleView = (id: number) => {
        router.push(`/experiments/${id}`);
    };

    const handleGenerateReport = (id: number) => {
        router.push(`/experiments/${id}/report`);
    };

    const prepareForDeletion = (selectedRows: GridRowSelectionModel) => {
        setSelectedExperimentIds(selectedRows);
        setShowDeletionDialog(true);
    };

    const handleDeleteExperiments = async () => {
        let deletedIds: number[] = [];
        let cannotDeleteIds: number[] = [];
        try {
            const deletePromises = selectedExperimentIds.map(
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
                        showAlert("error", String(error));
                    }
                }
            );
            await Promise.all(deletePromises);
            await reload();
            if (deletedIds.length > 0) {
                showAlert(
                    "success",
                    `The following experiments were successfully deleted: ${deletedIds.join(
                        ", "
                    )}`
                );
            }
            if (cannotDeleteIds.length > 0) {
                showAlert(
                    "warning",
                    `The following experiments contained recorded assay results and could not be deleted: ${cannotDeleteIds.join(
                        ", "
                    )}`
                );
            }
        } catch (error) {
            showAlert("error", String(error));
        }
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
                            onSearch={setSearchQuery}
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
                        onClick={() => setShowCreationDialog(true)}
                    >
                        Add Experiment
                    </Button>
                </Box>
                {loadingExperiments ? (
                    <LoadingContainer text="Loading Experiments..." />
                ) : (
                    <Table
                        columns={colDefs}
                        rows={experimentData}
                        pagination
                        onDeleteRows={prepareForDeletion}
                        {...paginationProps}
                    />
                )}
                <ExperimentCreationDialog
                    open={showCreationDialog}
                    onClose={() => {
                        setShowCreationDialog(false);
                        reload();
                    }}
                />
                <ExperimentDeletionDialog
                    open={showDeletionDialog}
                    onClose={() => {
                        setShowDeletionDialog(false);
                    }}
                    onDelete={handleDeleteExperiments}
                />
            </Stack>
        </Layout>
    );
};

ExperimentList.displayName = "ExperimentList";
export default ExperimentList;
