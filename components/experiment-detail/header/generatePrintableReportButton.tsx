import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useRouter } from "next/router";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";

const GeneratePrintableReportButton: React.FC = () => {
    const router = useRouter();
    const experimentId = useExperimentId();
    return (
        <IconButtonWithTooltip
            text="Generate Report"
            icon={DescriptionIcon}
            onClick={() => router.push(`/experiments/${experimentId}/report`)}
        />
    );
};

export default GeneratePrintableReportButton;
