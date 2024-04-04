import { useRouter } from "next/router";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import { Print } from "@mui/icons-material";
import { Icon, SvgIconTypeMap } from "@mui/material";
import icon from "./labelIcon.svg";
import Image from "next/image";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface PrintLabelsButtonProps {
    experimentId: number;
    size?: "small" | "medium" | "large";
}

const PrintLabelsIconButton: OverridableComponent<SvgIconTypeMap<{}, "svg">> = () => {
    return (<Icon>
        <Image src={icon} alt="Print sample labels" />
    </Icon>);
};

const PrintLabelsButton: React.FC<PrintLabelsButtonProps> = (
    props: PrintLabelsButtonProps
) => {
    const router = useRouter();
    console.log(icon);
    return (
        <IconButtonWithTooltip
            text="Print Sample Labels"
            icon={PrintLabelsIconButton}
            onClick={() =>
                router.push(`/api/experiments/${props.experimentId}/printLabels`)
            }
            size={props.size}
        />
    );
};

export default PrintLabelsButton;
