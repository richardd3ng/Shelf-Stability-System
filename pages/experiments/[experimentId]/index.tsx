import Layout from "@/components/shared/layout";
import AssaysGroupedByType from "@/components/experiment-detail/assaysGroupedByType";
import { ExperimentHeader } from "@/components/experiment-detail/header/experimentHeader";
import { Box, Container, Typography} from "@mui/material";
import DeleteExperimentButton from "@/components/experiment-detail/deleteExperimentButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { useContext } from "react";
<<<<<<< HEAD
import { AssayTypes } from "@/components/experiment-detail/assayTypes/assayTypes";
import ExperimentTable from "@/components/experiment-detail/experimentTable/experimentTable";
import { ExperimentInfo } from "@/lib/controllers/types";
=======
import CancelExperimentButton from "@/components/experiment-detail/cancelExperimentButton";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
>>>>>>> 73473c57c6121c1c6fd2081ebee8bf44538da993

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
<<<<<<< HEAD
            
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
=======
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    paddingY: 2,
                    visibility: isAdmin ? "visible" : "hidden",
                }}
            >
                <CancelExperimentButton
                    cancel={!experimentInfo?.experiment.isCanceled}
                />
                <DeleteExperimentButton />
            </Box>
>>>>>>> 73473c57c6121c1c6fd2081ebee8bf44538da993
        </Layout>
    );
};

export default ExperimentPage;
