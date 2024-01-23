import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ExperimentListItem from "./experiment-list-item";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SearchBar from "../components/search-bar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ViewIcon from "@mui/icons-material/Visibility";
import * as React from "react";

const fetchExperiments = () => {
  const mockData = [
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
  const mockData = fetchExperiments();
  const experimentListItems = mockData.map((experiment, _) => (
    <Container sx={{ py: 0.25 }}>
      <ExperimentListItem {...experiment} />
    </Container>
  ));
  return (
    <List>
      {FilterHeaders()}
      {experimentListItems}
    </List>
  );
};

export default function ExperimentList() {
  return (
    <Stack spacing={2}>
      {ActionBar()}
      {ListDisplay()}
    </Stack>
  );
}
