import Layout from "@/components/shared/layout";
import AssaysGroupedByType from "@/components/experiment-detail/assaysGroupedByType";
import { AssayEditorModal } from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import { ExperimentHeader } from "@/components/experiment-detail/summary/experimentHeader";
import { Container, Stack } from "@mui/material";
import { GenerateReportsOptions } from "@/components/experiment-detail/generateReportsOptions/generateReportsOptions";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";

const ExperimentPage = () => {
    return (
        <Layout>
            <ExperimentHeader />
            <AssayEditorModal />
            <AssaysGroupedByType />
            <Container
                maxWidth="sm"
                style={{ marginTop: 24, marginBottom: 24 }}
            >
                <Stack>
                    <GenerateReportsOptions />
                    {/* <DeleteExperimentButton /> */}
                </Stack>
            </Container>
        </Layout>
    );
};

export default ExperimentPage;
