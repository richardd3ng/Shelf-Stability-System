import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import { useMutationToDuplicateExperiment } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";

const DuplicateExperimentIconButton: React.FC = () => {
    const experimentId = useExperimentId();
    const { mutate: duplicateExperiment } = useMutationToDuplicateExperiment();

    return (
        <IconButtonWithTooltip
            text="Duplicate Experiment"
            icon={ContentCopyIcon}
            onClick={() => duplicateExperiment(experimentId)}
            size="large"
        />
    );
};

export default DuplicateExperimentIconButton;
