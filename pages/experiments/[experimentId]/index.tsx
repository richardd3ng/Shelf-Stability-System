import Layout from "@/components/shared/layout";
import AssaysGroupedByType from "@/components/experiment-detail/assaysGroupedByType";
import { ExperimentHeader } from "@/components/experiment-detail/header/experimentHeader";
import { Stack, Container, Typography, Box } from "@mui/material";
import DeleteExperimentButton from "@/components/experiment-detail/deleteExperimentButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { useContext } from "react";
import CancelExperimentButton from "@/components/experiment-detail/cancelExperimentButton";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { ExperimentInfo } from "@/lib/controllers/types";
import { AssayTypes } from "@/components/experiment-detail/assayTypes/assayTypes";
import ExperimentTable from "@/components/experiment-detail/experimentTable/experimentTable";

const ExperimentPage = () => {
    const { user } = useContext(CurrentUserContext);
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const isAdmin: boolean = user?.isAdmin ?? false;
    return (
        <Layout>
            <ExperimentHeader />
            <Container style={{backgroundColor : "white"}}>
                <Typography variant="h5" style={{marginBottom : 16, marginTop: 8}}>Assay Schedule</Typography>
                <ExperimentTable
                    assayFilter={(experimentInfo: ExperimentInfo) =>
                        experimentInfo.assays
                    }
                />
            </Container>
            <AssayTypes/>
            <AssaysGroupedByType />

            
            {
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
            }

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
