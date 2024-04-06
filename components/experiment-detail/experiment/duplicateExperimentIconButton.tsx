import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import {
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationArgs,
} from "@/lib/controllers/types";
import { createExperiment } from "@/lib/controllers/experimentController";
import { createAssay } from "@/lib/controllers/assayController";
import { AssayCreationArgs } from "@/lib/controllers/types";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useRouter } from "next/router";
import { ApiError } from "next/dist/server/api-utils";

const DuplicateExperimentIconButton: React.FC = () => {
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const router = useRouter();

    if (!experimentInfo) {
        return null;
    }

    const attemptCopy = async (number: number) => {
        try {
            const conditionCreationArgsNoExperimentIdArray: ConditionCreationArgsNoExperimentId[] =
                experimentInfo.conditions.map((condition) => ({
                    name: condition.name,
                    isControl: condition.isControl,
                }));
            const experimentData: ExperimentCreationArgs = {
                title: `${experimentInfo.experiment.title} - copy${
                    number === 1 ? "" : ` ${number}`
                }`,
                description: experimentInfo.experiment.description,
                startDate: experimentInfo.experiment.startDate,
                conditionCreationArgsNoExperimentIdArray:
                    conditionCreationArgsNoExperimentIdArray,
                ownerId: experimentInfo.experiment.ownerId,
                weeks: experimentInfo.experiment.weeks,
            };
            const id = await createExperiment(experimentData).then(
                (res) => res.experiment.id
            );
            experimentInfo.assays.forEach((assay) => {
                const assayInfo: AssayCreationArgs = {
                    experimentId: id,
                    conditionId: assay.conditionId,
                    assayTypeId: assay.assayTypeId,
                    week: assay.week,
                    sample: assay.sample,
                };
                createAssay(assayInfo);
            });
            showAlert(
                "success",
                `Succesfully created experiment ${id} from experiment ${experimentId}`
            );
            router.push(`/experiments/${id}`);
        } catch (error) {
            const apiError: ApiError = error as ApiError;
            if (
                apiError.message.startsWith("An experiment with the name") &&
                apiError.message.endsWith("already exists")
            ) {
                await attemptCopy(number + 1);
            } else {
                showAlert("error", apiError.message);
            }
        }
    };

    const duplicateExperiment = async () => {
        showLoading(`Duplicating experiment ${experimentId}...`);
        attemptCopy(1);
        hideLoading();
    };

    return (
        <IconButtonWithTooltip
            text="Duplicate Experiment"
            icon={ContentCopyIcon}
            onClick={() => duplicateExperiment()}
            size="large"
        />
    );
};

export default DuplicateExperimentIconButton;
