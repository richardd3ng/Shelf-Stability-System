import {
    Box,
    Button,
    Container,
    IconButton,
    ListItem,
    List,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ExperimentCreationDialog from "@/components/experiment-list/experiment-creation-dialog";
import ExperimentListItem from "../../components/experiment-list/experiment-list-item";
import Layout from "../../components/shared/layout";
import SearchBar from "../../components/shared/search-bar";

interface ExperimentData {
    id: number;
    title: string;
    startDate: string;
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
            startDate: "2022-03-15",
            week: 3,
        },
        {
            id: 100001,
            title: "Chicken Experiment",
            startDate: "2022-04-20",
            week: 2,
        },
        {
            id: 100002,
            title: "Fried Rice Experiment",
            startDate: "2022-02-10",
            week: 4,
        },
        {
            id: 100003,
            title: "Sushi Experiment",
            startDate: "2022-01-05",
            week: 5,
        },
        {
            id: 100004,
            title: "Really Long Experiment Name That Should Be Truncated Will Need To Discuss How To Handle This Case?",
            startDate: "2022-03-01",
            week: 3,
        },
        {
            id: 100005,
            title: "Cereal Experiment",
            startDate: "2022-05-25",
            week: 1,
        },
        {
            id: 100006,
            title: "Frog Intestines Experiment",
            startDate: "2022-02-28",
            week: 4,
        },
        {
            id: 100007,
            title: "Scorpion Tail Experiment",
            startDate: "2022-04-12",
            week: 2,
        },
        {
            id: 100008,
            title: "Test 9",
            startDate: "2022-05-10",
            week: 1,
        },
        {
            id: 100009,
            title: "Test 10",
            startDate: "2022-01-20",
            week: 5,
        },
    ];
    return mockData;
};

const FilterHeaders = () => {
    return (
        <Container sx={{ py: 0.5 }}>
            <ListItem
                key={0}
                secondaryAction={
                    <ListItemText sx={{ flex: "0 0 10%" }} primary="Action" />
                }
            >
                <ListItemText sx={{ flex: "0 0 15%" }} primary={SortField.Id} />
                <ListItemText
                    sx={{ flex: "0 0 40%" }}
                    primary={SortField.Title}
                />
                <ListItemText
                    sx={{ flex: "0 0 20%" }}
                    primary={SortField.StartDate}
                />
                <ListItemText
                    sx={{ flex: "0 0 10%" }}
                    primary={SortField.Week}
                />
            </ListItem>
        </Container>
    );
};

const ExperimentList = () => {
    const [experimentData, setExperimentData] = useState<ExperimentData[]>([]);
    const [sortState, setSortState] = useState<SortState>({
        field: SortField.Id,
        ascending: true,
    });
    const [showExperiementCreationDialog, setShowExperimentCreationDialog] =
        useState<boolean>(false);

    useEffect(() => {
        const fetchDataAndSort = async () => {
            const mockData: ExperimentData[] = fetchExperiments();
            const sortedData = mockData.sort((a, b) => {
                switch (sortState.field) {
                    case SortField.Id:
                        return sortState.ascending ? a.id - b.id : b.id - a.id;
                    case SortField.Title:
                        return sortState.ascending
                            ? a.title.localeCompare(b.title)
                            : b.title.localeCompare(a.title);
                    case SortField.StartDate:
                        return sortState.ascending
                            ? a.startDate.localeCompare(b.startDate)
                            : b.startDate.localeCompare(a.startDate);
                    case SortField.Week:
                        return sortState.ascending
                            ? a.week - b.week
                            : b.week - a.week;
                    default:
                        return 0;
                }
            });
            setExperimentData(sortedData);
        };

        fetchDataAndSort();
    }, [sortState]);

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

    const handleEdit = (id: number) => {
        console.log("Edit");
    };

    const handleSearch = (query: string) => {
        console.log("Search: ", query);
        // TODO: Implement search on database
    };

    const toggleSortAscending = () => {
        setSortState((prevState: SortState) => {
            return {
                field: prevState.field,
                ascending: !prevState.ascending,
            };
        });
    };

    const SortArrow = () => {
        return (
            <IconButton
                edge="end"
                aria-label={"sort-arrow"}
                onClick={() => toggleSortAscending()}
                disableRipple
            >
                <ArrowUpward
                    sx={{
                        transition: "all 3s ease-in-out",
                        transform: sortState.ascending
                            ? "None"
                            : "rotate(180deg)",
                    }}
                />
            </IconButton>
        );
    };

    const ActionBar = () => {
        return (
            <Box
                sx={{
                    display: "flex",
                    paddingRight: 3,
                }}
            >
                <Container sx={{ width: "50%" }}>
                    <SearchBar
                        placeholder="Search Keyword"
                        onEnter={handleSearch}
                    />
                </Container>
                <Box
                    sx={{ width: "25%", display: "flex", alignItems: "center" }}
                >
                    <Typography sx={{ display: "inline" }}>Sort By:</Typography>
                    <Select
                        value={sortState.field}
                        onChange={(event) =>
                            setSortState({
                                field: event.target.value as SortField,
                                ascending: sortState.ascending,
                            })
                        }
                        sx={{
                            height: "30px",
                            width: "50%",
                            marginLeft: "12px",
                        }}
                    >
                        <MenuItem value={SortField.Id}>{SortField.Id}</MenuItem>
                        <MenuItem value={SortField.Title}>
                            {SortField.Title}
                        </MenuItem>
                        <MenuItem value={SortField.StartDate}>
                            {SortField.StartDate}
                        </MenuItem>
                        <MenuItem value={SortField.Week}>
                            {SortField.Week}
                        </MenuItem>
                    </Select>
                    <SortArrow />
                </Box>
                <Button
                    sx={{
                        width: "25%",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                    }}
                    onClick={handleAddExperiment}
                >
                    Add Experiment
                </Button>
            </Box>
        );
    };

    const ListDisplay = () => {
        const experimentListItems = experimentData.map((experiment, _) => (
            <Container key={experiment.id} sx={{ py: 0.25 }}>
                <ExperimentListItem
                    {...experiment}
                    onDelete={() => handleDelete(experiment.id)}
                    onEdit={() => handleEdit(experiment.id)}
                    onView={() => handleView(experiment.id)}
                />
            </Container>
        ));
        return (
            <List>
                {FilterHeaders()}
                {experimentListItems}
            </List>
        );
    };

    return (
        <Stack spacing={2}>
            {ActionBar()}
            {ListDisplay()}
            <ExperimentCreationDialog
                open={showExperiementCreationDialog}
                onClose={() => setShowExperimentCreationDialog(false)}
            />
        </Stack>
    );
};

export default () => {
    return (
        <Layout>
            <ExperimentList />
        </Layout>
    );
};
