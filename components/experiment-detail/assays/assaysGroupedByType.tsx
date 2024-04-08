import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    Accordion,
    Container,
    Typography,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import React from "react";
import { AssayTypeInfo, ExperimentInfo } from "@/lib/controllers/types";
import { ExpandMore } from "@mui/icons-material";
import ReportTable from "@/components/experiment-report/experimentTableReport/reportTable";

export const assayTypeHasAssays = (
    experimentInfo: ExperimentInfo,
    assayTypeForExperimentId: number
): boolean => {
    return experimentInfo.assays.some(
        (assay) => assay.assayTypeId === assayTypeForExperimentId
    );
};

const AssaysGroupedByType: React.FC = () => {
    const experimentId = useExperimentId();
    const { data, isLoading, isError } = useExperimentInfo(experimentId);

    if (isLoading || isError || !data) {
        return null;
    }
    return (
        <Container sx={{ marginTop: 2, minWidth: "100%" }}>
            {data.assayTypes.map((type: AssayTypeInfo) => {
                const typeId: number = type.id;
                if (assayTypeHasAssays(data, typeId)) {
                    return (
                        <Accordion key={typeId}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>
                                    Assays of type {type.assayType.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReportTable
                                    experimentInfo={data}
                                    assayFilter={(
                                        experimentInfo: ExperimentInfo
                                    ) =>
                                        experimentInfo.assays.filter(
                                            (assay) =>
                                                assay.assayTypeId === typeId
                                        )
                                    }
                                />
                            </AccordionDetails>
                        </Accordion>
                    );
                }
            })}
        </Container>
    );
};

export default AssaysGroupedByType;
