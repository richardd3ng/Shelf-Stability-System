import { useContext, useEffect, useState } from "react";
import {
    useExperimentInfo,
    useExperimentOwner,
} from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Divider, Stack, Typography } from "@mui/material";
import ExperimentEditorModal from "./experimentEditorModal";
import ExperimentEditingContext from "@/lib/context/experimentDetailPage/experimentEditingContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import DownloadExcelIconButton from "./downloadExcelIconButton";
import GenerateReportIconButton from "@/components/shared/generateReportIconButton";
import EditExperimentButton from "./editExperimentButton";
import DuplicateExperimentIconButton from "./duplicateExperimentIconButton";
import BackButton from "@/components/shared/backButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import PrintLabelsButton from "./printLabelsButton";
import { useRouter } from "next/router";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const { data: experimentInfo, isLoading } = useExperimentInfo(experimentId);
    const { data: owner } = useExperimentOwner(experimentId);
    const { showLoading, hideLoading } = useLoading();
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(CurrentUserContext);
    const isCanceled: boolean = experimentInfo?.experiment.isCanceled ?? false;
    const isEditable: boolean = (!isCanceled && user?.isAdmin) ?? false;
    const isDuplicatable: boolean = user?.isAdmin ?? false;
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            showLoading("Fetching experiment data...");
        } else {
            hideLoading();
        }
    }, [isLoading]);

    if (!experimentInfo) {
        return null;
    }
    return (
        <Stack>
            <Box sx={{ marginLeft: 2, marginBottom: 0.5 }}>
                <BackButton />
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
                    <Typography variant="h5" sx={{ margin: 1 }}>
                        {experimentInfo
                            ? experimentInfo.experiment.title
                            : null}
                    </Typography>
                    <Typography sx={{ fontSize: "medium", marginLeft: 0.5 }}>
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
                            top: 2,
                            right: 16,
                            borderRadius: 2,
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        {isEditable && (
                            <ExperimentEditingContext.Provider
                                value={{ isEditing, setIsEditing }}
                            >
                                <EditExperimentButton />
                            </ExperimentEditingContext.Provider>
                        )}
                        <GenerateReportIconButton
                            text="Generate Report"
                            size="large"
                            onClick={() =>
                                router.push(
                                    `/experiments/${experimentId}/report`
                                )
                            }
                        />
                        <DownloadExcelIconButton />
                        <PrintLabelsButton
                            experimentId={experimentId}
                            size="large"
                        />
                        {isDuplicatable && <DuplicateExperimentIconButton />}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignContent: "flex-end",
                        paddingX: 2,
                        paddingBottom: 2,
                    }}
                >
                    <Stack sx={{ flex: 6, marginX: 1 }}>
                        <Divider sx={{ marginBottom: 1 }} />
                        <Typography sx={{ fontWeight: "bold" }}>
                            About this Experiment
                        </Typography>
                        <Typography align="left" whiteSpace={"pre-line"}>
                            {experimentInfo
                                ? experimentInfo.experiment.description
                                : null}
                        </Typography>
                    </Stack>
                    <Divider
                        orientation="vertical"
                        sx={{ height: "auto", marginTop: 4 }}
                    />
                    <Stack sx={{ flex: 1, marginTop: 1, marginLeft: 2 }}>
                        {owner && (
                            <Stack>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    Owner
                                </Typography>
                                <Typography>
                                    {`${owner.displayName} (${owner.username})`}
                                </Typography>
                            </Stack>
                        )}
                        <Divider sx={{ marginY: 1 }} />
                        <Stack>
                            <Typography sx={{ fontWeight: "bold" }}>
                                Start Date
                            </Typography>{" "}
                            <Typography>{`${experimentInfo.experiment.startDate}`}</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
            <ExperimentEditingContext.Provider
                value={{ isEditing, setIsEditing }}
            >
                <ExperimentEditorModal />
            </ExperimentEditingContext.Provider>
        </Stack>
    );
};
