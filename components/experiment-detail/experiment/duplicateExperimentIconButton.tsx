import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import { useMutationToDuplicateExperiment } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useState } from "react";
import { useLoading } from "@/lib/context/shared/loadingContext";

const DuplicateExperimentIconButton: React.FC = () => {
    const experimentId = useExperimentId();
    const { mutate: duplicateExperiment } = useMutationToDuplicateExperiment();
    const [disabled, setDisabled] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    const handleDuplicate = () => {
        showLoading(`Duplicating Experiment ${experimentId}...`);
        setDisabled(true);
        duplicateExperiment(experimentId, {
            onSettled: () => {
                setDisabled(false);
                hideLoading();
            },
        });
    };

    return (
        <IconButtonWithTooltip
            text="Duplicate Experiment"
            icon={ContentCopyIcon}
            onClick={handleDuplicate}
            size="large"
            disabled={disabled}
        />
    );
};

export default DuplicateExperimentIconButton;
