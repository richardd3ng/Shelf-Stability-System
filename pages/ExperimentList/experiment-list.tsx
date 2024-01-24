import {
  Box,
  Button,
  Container,
  ListItem,
  List,
  ListItemText,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import ExperimentListItem from "./experiment-list-item";
import SearchBar from "../components/search-bar";

interface ExperimentData {
  id: number;
  title: string;
  startDate: string;
  week: number;
}

const fetchExperiments = (): ExperimentData[] => {
  const mockData: ExperimentData[] = [
    {
      id: 100000,
      title: "Pizza Experiment",
      startDate: "2021-10-01",
      week: 1,
    },
    {
      id: 100001,
      title: "Chicken Experiment",
      startDate: "2021-12-01",
      week: 1,
    },
    {
      id: 100002,
      title: "Fried Rice Experiment",
      startDate: "2021-10-01",
      week: 1,
    },
    {
      id: 100003,
      title: "Sushi Experiment",
      startDate: "2021-06-30",
      week: 1,
    },
    {
      id: 100004,
      title:
        "Really Long Experiment Name That Should Be Truncated Will Need To Discuss How To Handle This Case?",
      startDate: "2021-06-30",
      week: 1,
    },
    {
      id: 100005,
      title: "Cereal Experiment",
      startDate: "2021-06-30",
      week: 1,
    },
    {
      id: 100006,
      title: "Frog Intestines Experiment",
      startDate: "2021-06-30",
      week: 1,
    },
    {
      id: 100007,
      title: "Scorpion Tail Experiment",
      startDate: "2021-06-30",
      week: 1,
    },
    {
      id: 100008,
      title: "Test 9",
      startDate: "2021-06-30",
      week: 1,
    },
    {
      id: 100009,
      title: "Test 10",
      startDate: "2021-06-30",
      week: 1,
    },
  ];

  return mockData;
};

const ExperimentList = () => {
  const [experimentData, setExperimentData] = useState<ExperimentData[]>([]);

  useEffect(() => {
    const mockData: ExperimentData[] = fetchExperiments();
    setExperimentData(mockData);
  }, []);

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

  const ActionBar = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <SearchBar placeholder="Search Keyword" />
        <Button sx={{ width: "25%" }}>Add Experiment</Button>
      </Box>
    );
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
          <ListItemText sx={{ flex: "0 0 15%" }} primary="#" />
          <ListItemText sx={{ flex: "0 0 40%" }} primary="Title" />
          <ListItemText sx={{ flex: "0 0 20%" }} primary="Start Date" />
          <ListItemText sx={{ flex: "0 0 10%" }} primary="Week" />
        </ListItem>
      </Container>
    );
  };

  const ListDisplay = () => {
    const experimentListItems = experimentData.map((experiment, _) => (
      <Container sx={{ py: 0.25 }}>
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
    </Stack>
  );
};

export default ExperimentList;
