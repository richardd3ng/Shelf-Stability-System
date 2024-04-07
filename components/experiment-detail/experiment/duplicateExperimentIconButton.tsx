import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import {
    AssayTypeInfo,
    ConditionCreationArgsNoExperimentId,
    ExperimentCreationArgs,
} from "@/lib/controllers/types";
import { createExperiment } from "@/lib/controllers/experimentController";
import { createAssay } from "@/lib/controllers/assayController";
import { createNewCustomAssayTypeForExperimentThroughAPI } from "@/lib/controllers/assayTypeController";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useRouter } from "next/router";
import { ApiError } from "next/dist/server/api-utils";
import { Condition } from "@prisma/client";

const DuplicateExperimentIconButton: React.FC = () => {
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const router = useRouter();

    if (!experimentInfo) {
        return null;
    }

    const getNewConditionId = (
        newConditions: Condition[],
        oldConditionId: number
    ): number => {
        const oldCondition = experimentInfo.conditions.find(
            (condition) => condition.id === oldConditionId
        );
        if (!oldCondition) {
            throw new Error("Duplication error: old condition does not exist");
        }
        const newCondition = newConditions.find(
            (condition) => condition.name === oldCondition.name
        );
        if (!newCondition) {
            throw new Error("Duplication error: new condition does not exist");
        }
        return newCondition.id;
    };

    const getNewAssayTypeForExperimentId = (
        newAssayTypeInfos: AssayTypeInfo[],
        oldAssayTypeForExperimentId: number
    ): number => {
        const oldAssayTypeInfo = experimentInfo.assayTypes.find(
            (assayType) => assayType.id === oldAssayTypeForExperimentId
        );
        if (!oldAssayTypeInfo) {
            throw new Error("Duplication error: old assay type does not exist");
        }
        const newAssayTypeForExperiment = newAssayTypeInfos.find(
            (assayTypeInfo) =>
                assayTypeInfo.assayType.name === oldAssayTypeInfo.assayType.name
        );
        if (!newAssayTypeForExperiment) {
            throw new Error("Duplication error: new assay type does not exist");
        }
        return newAssayTypeForExperiment.id;
    };

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
            const { experiment: newExperiment, conditions: newConditions } =
                await createExperiment(experimentData);
            const newAssayTypeInfos: AssayTypeInfo[] = [];
            await Promise.all(
                experimentInfo.assayTypes.map(async (assayTypeInfo) => {
                    const newAssayTypeInfo =
                        await createNewCustomAssayTypeForExperimentThroughAPI({
                            description: assayTypeInfo.assayType.description,
                            name: assayTypeInfo.assayType.name,
                            units: assayTypeInfo.assayType.units,
                            experimentId: newExperiment.id,
                            technicianId: assayTypeInfo.technicianId,
                        });
                    newAssayTypeInfos.push(newAssayTypeInfo);
                })
            );
            experimentInfo.assays.forEach(async (assay) => {
                await createAssay({
                    experimentId: newExperiment.id,
                    conditionId: getNewConditionId(
                        newConditions,
                        assay.conditionId
                    ),
                    assayTypeId: getNewAssayTypeForExperimentId(
                        newAssayTypeInfos,
                        assay.assayTypeId
                    ),
                    week: assay.week,
                    sample: assay.sample,
                });
            });
            showAlert(
                "success",
                `Succesfully created experiment ${newExperiment.id} from experiment ${experimentId}`
            );
            router.push(`/experiments/${newExperiment.id}`);
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
