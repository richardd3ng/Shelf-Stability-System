import AssayEditForm from "@/components/experiment-detail/assays/assayEditForm";
import Layout from "@/components/shared/layout";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function ResultEntryPage() {
    const router = useRouter();
    const { experimentId, assayId } = router.query;

    return (
        <Layout>
            <Box sx={{ px: 1.5 }}>
                <Typography variant="h4" marginBottom={1}>
                    Enter Assay Result
                </Typography>
                <AssayEditForm
                    experimentId={Number(experimentId)}
                    assayId={Number(assayId)}
                    onSubmit={() =>
                        router.push(
                            `/experiments/${experimentId}/result/confirmation`
                        )
                    }
                    loadForeverOnSubmit
                />
            </Box>
        </Layout>
    );
}
