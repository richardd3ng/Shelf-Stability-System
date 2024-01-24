import { Box, IconButton, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ViewIcon from "@mui/icons-material/Visibility";

interface ExperimentListItemProps {
  id: number;
  title: string;
  startDate: string;
  week: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ExperimentListItem = (props: ExperimentListItemProps) => {
  return (
    <ListItem
      key={props.id}
      sx={{ border: 0.5 }}
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="view" onClick={props.onView}>
            <ViewIcon />
          </IconButton>
          <IconButton edge="end" aria-label="edit" onClick={props.onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      }
    >
      <ListItemText sx={{ flex: "0 0 15%" }} primary={props.id} />
      <ListItemText sx={{ flex: "0 0 40%" }} primary={props.title} />
      <ListItemText sx={{ flex: "0 0 20%" }} primary={props.startDate} />
      <ListItemText sx={{ flex: "0 0 10%" }} primary={props.week} />
    </ListItem>
  );
};

export default ExperimentListItem;
