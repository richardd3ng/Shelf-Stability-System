import { generateExcelReport } from "@/lib/generateExcelExperimentReport";
import {
    useExperimentInfo,
    useExperimentOwner,
} from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import DownloadIcon from "@mui/icons-material/Download";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import { useAllUsers } from "@/lib/hooks/useAllUsers";

const DownloadExcelIconButton: React.FC = () => {
    const experimentId = useExperimentId();
    const { data: experiment } = useExperimentInfo(experimentId);
    const { data: owner } = useExperimentOwner(experimentId);
    // TODO this probably should not be required - just used for technician names
    const { data: users } = useAllUsers();

    return experiment && owner && users ? (
        <IconButtonWithTooltip
            text="Export Data to Excel"
            icon={DownloadIcon}
            onClick={() => generateExcelReport(experiment, owner.username, users)}
            size="large"
        />
    ) : null;
};

export default DownloadExcelIconButton;
