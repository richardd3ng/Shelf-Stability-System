import { useContext, useEffect, useState } from "react";
import {
    useExperimentInfo,
    useExperimentOwner,
} from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Stack, Typography } from "@mui/material";
import ExperimentEditorModal from "./experimentEditorModal";
import ExperimentEditingContext from "@/lib/context/experimentDetailPage/experimentEditingContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import DownloadExcelIconButton from "./downloadExcelIconButton";
import GenerateReportIconButton from "@/components/shared/generateReportIconButton";
import EditExperimentButton from "./editExperimentButton";
import BackButton from "@/components/shared/backButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const {
        data: experimentInfo,
        isLoading,
        isError,
    } = useExperimentInfo(experimentId);
    const { data: owner } = useExperimentOwner(experimentId);
    const { showLoading, hideLoading } = useLoading();
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(CurrentUserContext);
    const isCanceled: boolean = experimentInfo?.experiment.isCanceled ?? false;
    const isEditable: boolean = (!isCanceled && user?.isAdmin) ?? false;

    useEffect(() => {
        if (isLoading) {
            showLoading("Fetching experiment data...");
        } else {
            hideLoading();
        }
    }, [isLoading, showLoading, hideLoading]);

    if (isError || !experimentInfo) {
        return <></>;
    }
    return (
        <Stack>
            <Box sx={{ marginLeft: 2, marginBottom: 0.5 }}>
                <BackButton text="Back to Experiment List" />
            </Box>
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
                    <Typography variant="h5" sx={{ marginTop: 1 }}>
                        {experimentInfo
                            ? experimentInfo.experiment.title
                            : null}
                    </Typography>
                    <Typography sx={{ fontSize: "small", marginLeft: 0.5 }}>
                        #{experimentId}
                    </Typography>
                    {isCanceled && (
                        <Typography
                            variant="h5"
                            sx={{ marginTop: 1, marginLeft: 1, color: "red" }}
                        >
                            {"[Canceled]"}
                        </Typography>
                    )}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                        }}
                    >
                        {isEditable && (
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
                <Typography align="center" variant="h6" whiteSpace={"pre-line"}>
                    {experimentInfo
                        ? experimentInfo.experiment.description
                        : null}
                </Typography>
                {owner && (
                    <Typography
                        align="center"
                        variant="h6"
                        sx={{ marginBottom: 1 }}
                    >
                        {`Started ${experimentInfo.experiment.startDate.toString()} by 
                    ${owner.username}`}
                    </Typography>
                )}
            </Box>
            <ExperimentEditingContext.Provider
                value={{ isEditing, setIsEditing }}
            >
                <ExperimentEditorModal />
            </ExperimentEditingContext.Provider>
        </Stack>
    );
};
