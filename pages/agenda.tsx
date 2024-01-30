import { CheckBox } from "@mui/icons-material";
import { Box, Container, List, ListItem, ListItemText, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

interface Assay {
    id: number;
    targetDate: string;
    title: string;
    condition: string;
    week: number;
    type: string;
}

enum Fields {
    Id = "ID",
    TargetDate = "Target Date",
    Title = "Title",
    Condition = "Condition",
    Week = "Week",
    Type = "Type",
}

function fetchExperiments(): Assay[] {
    return [
        {
            id: 100000,
            targetDate: "2024-01-25",
            title: "Pizza Experiment",
            condition: "0F",
            week: 3,
            type: "Sensory"
        },
        {
            id: 100001,
            targetDate: "2024-02-01",
            title: "Pizza Experiment",
            condition: "0F",
            week: 4,
            type: "Hexanal"
        },
        {
            id: 100002,
            targetDate: "2022-02-01",
            title: "Pizza Experiment",
            condition: "0F",
            week: 4,
            type: "Sensory"
        },
        {
            id: 100003,
            targetDate: "2022-02-01",
            title: "Cereal Experiment",
            condition: "10F",
            week: 2,
            type: "Sensory"
        },
        {
            id: 100004,
            targetDate: "2022-02-01",
            title: "Cereal Experiment",
            condition: "20F",
            week: 2,
            type: "Sensory"
        },
        {
            id: 100005,
            targetDate: "2022-02-08",
            title: "Cereal Experiment",
            condition: "20F",
            week: 3,
            type: "Sensory"
        },
    ];
};

function FilterHeaders() {
    return (
        <TableRow>
            <TableCell>{Fields.TargetDate}</TableCell>
            <TableCell>{Fields.Title}</TableCell>
            <TableCell>{Fields.Condition}</TableCell>
            <TableCell>{Fields.Week}</TableCell>
            <TableCell>{Fields.Type}</TableCell>
        </TableRow>
    );
};

function AssayItem(experiment: Assay) {
    return (
        <TableRow key={experiment.id}>
            <TableCell>{experiment.targetDate}</TableCell>
            <TableCell>{experiment.title}</TableCell>
            <TableCell>{experiment.condition}</TableCell>
            <TableCell>{experiment.week}</TableCell>
            <TableCell>{experiment.type}</TableCell>
        </TableRow>
    );
}

export default function AssayAgenda() {
    return (
        <Stack spacing={2}>
            <Box display="flex" flexDirection="row">
                <Stack direction="row" spacing={2}>
                    <DatePicker label="From" />
                    <DatePicker label="To" />
                </Stack>
                <Box display="flex" flexDirection="row" justifyContent="flex-end " flexGrow="1" alignItems="center">
                    <CheckBox />
                    Include Recorded Assays
                </Box>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        {FilterHeaders()}
                    </TableHead>
                    <TableBody>
                        {fetchExperiments().map(AssayItem)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
