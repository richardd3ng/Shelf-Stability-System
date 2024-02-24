import { useState } from "react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { IconButton, Tooltip } from "@mui/material";

interface IconButtonWithTooltipProps {
    onClick: () => void;
    text: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
}

const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = (
    props: IconButtonWithTooltipProps
) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    return (
        <Tooltip
            title={props.text}
            open={showTooltip}
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, -14],
                            },
                        },
                    ],
                },
            }}
        >
            <IconButton
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={props.onClick}
            >
                <props.icon />
            </IconButton>
        </Tooltip>
    );
};

export default IconButtonWithTooltip;
