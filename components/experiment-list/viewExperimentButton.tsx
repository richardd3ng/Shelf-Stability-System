import { useRouter } from "next/router";
import ViewIcon from "@mui/icons-material/Visibility";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";

interface ViewExperimentButtonProps {
    experimentId: number;
}

const ViewExperimentButton: React.FC<ViewExperimentButtonProps> = (
    props: ViewExperimentButtonProps
) => {
    const router = useRouter();
    return (
        <IconButtonWithTooltip
            text="View Details"
            icon={ViewIcon}
            onClick={() => router.push(`/experiments/${props.experimentId}`)}
        />
    );
};

export default ViewExperimentButton;
