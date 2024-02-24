import Layout from "@/components/shared/layout";
import AssaysGroupedByType from "@/components/experiment-detail/assaysGroupedByType";
import AssayEditorModal from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import { ExperimentHeader } from "@/components/experiment-detail/header/experimentHeader";
import { Box } from "@mui/material";
import DeleteExperimentButton from "@/components/experiment-detail/deleteExperimentButton";

const ExperimentPage = () => {
    return (
        <Layout>
            <ExperimentHeader />
            <AssayEditorModal />
            <AssaysGroupedByType />
            <Box
                sx={{ display: "flex", justifyContent: "center", paddingY: 2 }}
            >
                <DeleteExperimentButton />
            </Box>
        </Layout>
    );
};

export default ExperimentPage;
