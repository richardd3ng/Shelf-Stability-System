import { generateExcelReport } from "@/lib/generateExcelReport";
import { useExperimentInfo, useExperimentOwner } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Typography, Button, Stack } from "@mui/material"
import { useRouter } from "next/router";

export const GenerateExcelReportButton = () => {
    const experimentId = useExperimentId();
    const {data : experiment} = useExperimentInfo(experimentId);
    const {data : owner} = useExperimentOwner(experimentId);

    if (experiment && owner){
        return (
            <Typography align="center" style={{ marginBottom: 8 }}>
                <Button
                    variant="outlined"
                    onClick={() => generateExcelReport(experiment, owner.username)}
                    style={{ textTransform: "none" }}
                >
                    <Typography align="center">
                        Download Excel report
                    </Typography>
                </Button>
            </Typography>
        )
    } else {
        return null;
    }
    
}