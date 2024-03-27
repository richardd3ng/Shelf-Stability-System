import { useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import ExperimentDetailContext from "@/lib/context/experimentDetailPage/experimentEditingContext";

const EditExperimentButton: React.FC = () => {
    const { setIsEditing } = useContext(ExperimentDetailContext);

    return (
        <IconButtonWithTooltip
            text="Edit Experiment"
            icon={EditIcon}
            onClick={() => setIsEditing(true)}
        />
    );
};

export default EditExperimentButton;
