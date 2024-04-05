import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { IconButton, Tooltip } from "@mui/material";

interface IconButtonWithTooltipProps {
    onClick: () => void;
    text: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    size?: "small" | "medium" | "large";
}

const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = (
    props: IconButtonWithTooltipProps
) => {

    return (
        <Tooltip
            title={props.text}
        >
            <IconButton
                onClick={props.onClick}
            >
                <props.icon
                    sx={{
                        fontSize:
                            props.size === "large"
                                ? 30
                                : props.size === "small"
                                    ? 18
                                    : null,
                    }}
                />
            </IconButton>
        </Tooltip>
    );
};

export default IconButtonWithTooltip;
