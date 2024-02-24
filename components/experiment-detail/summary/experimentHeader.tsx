import { useEffect, useState } from "react";
import {
    useExperimentInfo,
    useExperimentOwner,
} from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExperimentEditorModal from "../modifications/editorModals/experimentEditorModal";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import ExperimentEditingContext from "@/lib/context/experimentDetailPage/experimentEditingContext";
import { useLoading } from "@/lib/context/shared/loadingContext";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const {
        data: experimentInfo,
        isLoading,
        isError,
        error,
    } = useExperimentInfo(experimentId);
    const { data: owner } = useExperimentOwner(experimentId);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { showLoading, hideLoading } = useLoading();

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
                    <IconButton
                        aria-label="edit"
                        onClick={() => setIsEditing(true)}
                        sx={{ position: "absolute", top: 0, right: 0 }}
                    >
                        <EditIcon />
                    </IconButton>
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
