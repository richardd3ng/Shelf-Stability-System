import Layout from "@/components/shared/layout";
import AssaysGroupedByType from "@/components/experiment-detail/assays/assaysGroupedByType";
import { ExperimentHeader } from "@/components/experiment-detail/experiment/experimentHeader";
import { Container, Stack, Typography } from "@mui/material";
import DeleteExperimentButton from "@/components/experiment-detail/experiment/deleteExperimentButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { useContext } from "react";
import CancelExperimentButton from "@/components/experiment-detail/experiment/cancelExperimentButton";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { ExperimentInfo } from "@/lib/controllers/types";
import { AssayTypes } from "@/components/experiment-detail/assayTypes/assayTypes";
import ExperimentTable from "@/components/experiment-detail/experiment/experimentTable";

const ExperimentPage = () => {
    const { user } = useContext(CurrentUserContext);
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const isAdmin: boolean = user?.isAdmin ?? false;

    return (
        <Layout>
            <ExperimentHeader />
            <Container style={{ backgroundColor: "white" }}>
                <Typography
                    variant="h5"
                    style={{ marginBottom: 16, marginTop: 8, paddingTop: 8 }}
                >
                    Assay Schedule
                </Typography>
                <ExperimentTable
                    assayFilter={(experimentInfo: ExperimentInfo) =>
                        experimentInfo.assays
                    }
                />
            </Container>

            <AssayTypes />

            <AssaysGroupedByType />
            <Stack
                spacing={1}
                sx={{
                    paddingY: 2,
                    visibility: isAdmin ? "visible" : "hidden",
                }}
            >
                <CancelExperimentButton
                    cancel={!experimentInfo?.experiment.isCanceled}
                />
                <DeleteExperimentButton />
            </Stack>
        </Layout>
    );
};

export default ExperimentPage;
