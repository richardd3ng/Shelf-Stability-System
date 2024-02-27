import { useEffect } from "react";
import ReportHeader from "@/components/experiment-report/reportHeader";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentOwner } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { useAlert } from "@/lib/context/shared/alertContext";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import { Box, Stack } from "@mui/material";
import ReportAssaysGroupedByType from "@/components/experiment-report/reportAssaysGroupedByType";
import BackButton from "@/components/shared/backButton";

const ExperimentReport: React.FC = () => {
    const experimentId = useExperimentId();
    const {
        data: experimentInfo,
        isLoading,
        isError,
        error,
    } = useExperimentInfo(experimentId);
    const { data: owner } = useExperimentOwner(experimentId);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();

    useEffect(() => {
        if (isError) {
            showAlert("error", getErrorMessage(error));
        } else if (isLoading) {
            showLoading("Generating experiment report...");
        } else {
            hideLoading();
        }
    }, [isLoading, showLoading, hideLoading, isError, showAlert, error]);

    if (!experimentInfo || !owner) {
        return null;
    }
    return (
        <Stack gap={2}>
            <Box sx={{ "@media print": { display: "none" }, marginTop: 1 }}>
                <BackButton text="Back" />
            </Box>
            <ReportHeader
                experimentInfo={experimentInfo}
                owner={owner.username}
            />
            <ReportAssaysGroupedByType experimentInfo={experimentInfo} />
        </Stack>
    );
};

export default ExperimentReport;
