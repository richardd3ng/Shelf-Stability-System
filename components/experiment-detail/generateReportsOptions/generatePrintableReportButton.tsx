import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Typography, Button, Stack } from "@mui/material"
import { useRouter } from "next/router";

export const GeneratePrintableReportButton = () => {
    const router = useRouter();
    const experimentId = useExperimentId();
    return (
        <Typography align="center" style={{ marginBottom: 8 }}>
            <Button
                variant="outlined"
                onClick={() =>
                    router.push(
                        `/experiments/${experimentId}/report`
                    )
                }
                style={{ textTransform: "none" }}
            >
                <Typography align="center">
                    Generate a report for this experiment
                </Typography>
            </Button>
        </Typography>
    )
}