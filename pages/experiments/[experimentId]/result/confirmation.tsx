import Layout from "@/components/shared/layout";
import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLoading } from "@/lib/context/shared/loadingContext";

const ResultConfirmationPage: React.FC = () => {
    const router = useRouter();
    const { experimentId } = router.query;
    const { hideLoading } = useLoading();

    useEffect(() => {
        hideLoading();
    }, [hideLoading]);

    return (
        <Layout>
            <Box
                sx={{ px: 1.5 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
            >
                <Box textAlign="center">
                    <CheckCircle sx={{ fontSize: 64, color: "green" }} />
                    <Typography variant="h4" marginBottom={1}>
                        Assay Result Submitted
                    </Typography>
                    <Typography>
                        {`Your assay results for experiment ${experimentId} have been successfully recorded!`}
                    </Typography>
                </Box>
            </Box>
        </Layout>
    );
};

export default ResultConfirmationPage;
