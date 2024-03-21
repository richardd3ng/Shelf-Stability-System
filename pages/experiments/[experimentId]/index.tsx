import Layout from "@/components/shared/layout";
import AssaysGroupedByType from "@/components/experiment-detail/assaysGroupedByType";
import { ExperimentHeader } from "@/components/experiment-detail/header/experimentHeader";
import { Box } from "@mui/material";
import DeleteExperimentButton from "@/components/experiment-detail/deleteExperimentButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { useContext } from "react";
import CancelExperimentButton from "@/components/experiment-detail/cancelExperimentButton";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";

const ExperimentPage = () => {
    const { user } = useContext(CurrentUserContext);
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const isAdmin: boolean = user?.isAdmin ?? false;
    return (
        <Layout>
            <ExperimentHeader />
            <AssaysGroupedByType />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    paddingY: 2,
                    visibility: isAdmin ? "visible" : "hidden",
                }}
            >
                <DeleteExperimentButton />
            </Box>
            <CancelExperimentButton
                cancel={!experimentInfo?.experiment.isCanceled}
            />
        </Layout>
    );
};

export default ExperimentPage;
