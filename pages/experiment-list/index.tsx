import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import ExperimentCreationDialog from "@/components/experiment-list/experiment-creation-dialog";
import Layout from "../../components/shared/layout";
import SearchBar from "../../components/shared/search-bar";
import Table from "../../components/shared/table";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ViewIcon from "@mui/icons-material/Visibility";

interface ExperimentData {
    id: number;
    title: string;
    startDate: Date;
    week: number;
}

enum SortField {
    Id = "Number",
    Title = "Title",
    StartDate = "Start Date",
    Week = "Week",
    Action = "Action",
}

interface SortState {
    field: SortField;
    ascending: boolean;
}

const fetchExperiments = (): ExperimentData[] => {
    const mockData: ExperimentData[] = [
        {
            id: 100000,
            title: "Pizza Experiment",
            startDate: new Date("2022-03-15"),
            week: 3,
        },
        {
            id: 100001,
            title: "Chicken Experiment",
            startDate: new Date("2022-04-20"),
            week: 2,
        },
        {
            id: 100002,
            title: "Fried Rice Experiment",
            startDate: new Date("2022-02-10"),
            week: 4,
        },
        {
            id: 100003,
            title: "Sushi Experiment",
            startDate: new Date("2022-01-05"),
            week: 5,
        },
        {
            id: 100004,
            title: "Really Long Experiment Name That Should Be Truncated Will Need To Discuss How To Handle This Case?",
            startDate: new Date("2022-03-01"),
            week: 3,
        },
        {
            id: 100005,
            title: "Cereal Experiment",
            startDate: new Date("2022-05-25"),
            week: 1,
        },
        {
            id: 100006,
            title: "Frog Intestines Experiment",
            startDate: new Date("2022-02-28"),
            week: 4,
        },
        {
            id: 100007,
            title: "Scorpion Tail Experiment",
            startDate: new Date("2022-04-12"),
            week: 2,
        },
        {
            id: 100008,
            title: "Test 9",
            startDate: new Date("2022-05-10"),
            week: 1,
        },
        {
            id: 100009,
            title: "Test 10",
            startDate: new Date("2022-01-20"),
            week: 5,
        },
    ];
    return mockData;
};

const ExperimentList: React.FC = () => {
    const [experimentData, setExperimentData] = useState<ExperimentData[]>([]);
    const [sortState, setSortState] = useState<SortState>({
        field: SortField.Id,
        ascending: true,
    });
    const [showExperiementCreationDialog, setShowExperimentCreationDialog] =
        useState<boolean>(false);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        fetchAndSetData();
    }, [sortState]);

    const fetchAndSetData = async () => {
        const mockData: ExperimentData[] = fetchExperiments();
        setExperimentData(mockData);
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

    const handleSearch = (query: string) => {
        console.log("Search: ", query);
        // TODO: Implement search on database
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
        columns[0].valueFormatter = (params) => String(params.value);
        return columns;
    };

    const handleDeleteExperiments = (selectedRows: GridRowSelectionModel) => {
        const remainingRows = experimentData.filter(
            (row) => !selectedRows.includes(row.id)
        );
        setExperimentData(remainingRows);
    };

    return (
        <Layout>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "left",
                    paddingRight: 3,
                }}
            >
                <Container sx={{ flex: 2, marginRight: "25%" }}>
                    <SearchBar
                        placeholder="Search Keyword"
                        onEnter={handleSearch}
                    />
                </Container>
                <Button
                    sx={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        flex: 1,
                        marginLeft: "auto",
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
            />
            <ExperimentCreationDialog
                open={showExperiementCreationDialog}
                onClose={(reason: string) => handleCloseDialog(reason)}
            />
        </Layout>
    );
};

ExperimentList.displayName = "ExperimentList";
export default ExperimentList;
