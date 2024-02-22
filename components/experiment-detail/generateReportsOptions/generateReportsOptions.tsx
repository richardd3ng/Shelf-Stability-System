import React from "react";
import { Button, Typography, Container, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { GeneratePrintableReportButton } from "./generatePrintableReportButton";
import { GenerateExcelReportButton } from "./generateExcelReportButton";

export const GenerateReportsOptions = () => {
    const router = useRouter();
    const experimentId = useExperimentId();
    
    return (
        <Container
            maxWidth="sm"
            style={{ marginTop: 24, marginBottom: 24 }}
        >
            <Stack>
                <GeneratePrintableReportButton/>
                <GenerateExcelReportButton/>
            </Stack>
        </Container>
    )
}