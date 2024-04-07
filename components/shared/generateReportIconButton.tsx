import DescriptionIcon from "@mui/icons-material/Description";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";

interface GenerateReportIconButtonProps {
    text : string;
    onClick : () => void;
    size?: "small" | "medium" | "large";
}

const GenerateReportIconButton: React.FC<GenerateReportIconButtonProps> = (
    props: GenerateReportIconButtonProps
) => {
    return (
        <IconButtonWithTooltip
            text={props.text}
            icon={DescriptionIcon}
            onClick={() =>
                props.onClick()
            }
            size={props.size}
        />
    );
};

export default GenerateReportIconButton;
