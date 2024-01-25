import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface ExperimentCreationDialogProps {
  open: boolean;
  onClose: () => void;
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

const ExperimentCreationDialog = (props: ExperimentCreationDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Limit the title length
    if (newValue.length <= MAX_TITLE_LENGTH) {
      setTitle(newValue);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Limit the description length
    if (newValue.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(newValue);
    }
  };

  const handleAddExperiment = () => {};

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Add New Experiment</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <DialogContentText>
            Fill in the details for the new experiment.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            onChange={handleTitleChange}
            inputProps={{
              maxLength: MAX_TITLE_LENGTH,
            }}
            helperText={`${title.length}/${MAX_TITLE_LENGTH} characters`}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            multiline // Enable multiline
            rows={4} // Set the number of rows
            onChange={handleDescriptionChange}
            inputProps={{
              maxLength: MAX_DESCRIPTION_LENGTH,
            }}
            helperText={`${description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start Date" defaultValue={dayjs()} />
          </LocalizationProvider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleAddExperiment}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExperimentCreationDialog;
