import { useRouter } from "next/router";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";

interface GenerateReportIconButtonProps {
    experimentId: number;
}

const GenerateReportIconButton: React.FC<GenerateReportIconButtonProps> = (
    props: GenerateReportIconButtonProps
) => {
    const router = useRouter();
    return (
        <IconButtonWithTooltip
            text="Generate Report"
            icon={DescriptionIcon}
            onClick={() =>
                router.push(`/experiments/${props.experimentId}/report`)
            }
            size="large"
        />
    );
};

export default GenerateReportIconButton;
