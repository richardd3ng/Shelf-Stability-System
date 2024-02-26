import { useContext, useEffect, useState } from "react";
import {
    useExperimentInfo,
    useExperimentOwner,
} from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Typography } from "@mui/material";
import ExperimentEditorModal from "../modifications/editorModals/experimentEditorModal";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import ExperimentEditingContext from "@/lib/context/experimentDetailPage/experimentEditingContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import DownloadExcelIconButton from "./downloadExcelIconButton";
import GenerateReportIconButton from "@/components/shared/generateReportIconButton";
import EditExperimentButton from "./editExperimentButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const {
        data: experimentInfo,
        isLoading,
        isError,
        error,
    } = useExperimentInfo(experimentId);
    const { data: owner } = useExperimentOwner(experimentId);
    const { showLoading, hideLoading } = useLoading();
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(CurrentUserContext);
    const isAdmin: boolean = user?.is_admin ?? false;

    useEffect(() => {
        if (isLoading) {
            showLoading("Fetching experiment data...");
        } else {
            hideLoading();
        }
    }, [isLoading, showLoading, hideLoading]);

    if (isError || !experimentInfo) {
        return <ErrorMessage message={getErrorMessage(error)} />;
    }
    return (
        <>
            <Box
                sx={{
                    marginX: 3,
                    border: "1px black solid",
                    borderRadius: 2,
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                    }}
                >
                    <Typography variant="h4">
                        {experimentInfo
                            ? experimentInfo.experiment.title
                            : null}
                    </Typography>
                    <Typography sx={{ fontSize: "small", marginLeft: 0.5 }}>
                        #{experimentId}
                    </Typography>
                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                        {isAdmin && (
                            <ExperimentEditingContext.Provider
                                value={{ isEditing, setIsEditing }}
                            >
                                <EditExperimentButton />
                            </ExperimentEditingContext.Provider>
                        )}
                        <GenerateReportIconButton experimentId={experimentId} />
                        <DownloadExcelIconButton />
                    </Box>
                </Box>
                <Typography
                    align="center"
                    variant="h5"
                    style={{ marginBottom: 8 }}
                >
                    {experimentInfo
                        ? experimentInfo.experiment.description
                        : null}
                </Typography>
                {owner && (
                    <Typography
                        align="center"
                        variant="h5"
                        style={{ marginBottom: 8 }}
                    >
                        {`Started ${experimentInfo.experiment.start_date.toString()} by 
                    ${owner.username}`}
                    </Typography>
                )}
            </Box>
            <ExperimentEditingContext.Provider
                value={{ isEditing, setIsEditing }}
            >
                <ExperimentEditorModal />
            </ExperimentEditingContext.Provider>
        </>
    );
};
