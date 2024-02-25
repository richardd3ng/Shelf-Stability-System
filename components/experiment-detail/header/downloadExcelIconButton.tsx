import { generateExcelReport } from "@/lib/generateExcelReport";
import {
    useExperimentInfo,
    useExperimentOwner,
} from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import DownloadIcon from "@mui/icons-material/Download";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";

const DownloadExcelIconButton: React.FC = () => {
    const experimentId = useExperimentId();
    const { data: experiment } = useExperimentInfo(experimentId);
    const { data: owner } = useExperimentOwner(experimentId);

    return experiment && owner ? (
        <IconButtonWithTooltip
            text="Export Data to Excel"
            icon={DownloadIcon}
            onClick={() => generateExcelReport(experiment, owner.username)}
        />
    ) : null;
};

export default DownloadExcelIconButton;
