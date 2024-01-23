import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ViewIcon from "@mui/icons-material/Visibility";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface ExperimentListItemProps {
  id: number;
  title: string;
  startDate: string;
  week: number;
}

const ExperimentListItem = (props: ExperimentListItemProps) => {
  return (
    <ListItem
      sx={{ border: 0.5 }}
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="delete">
            <ViewIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete">
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete">
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
