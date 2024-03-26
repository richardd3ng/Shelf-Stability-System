import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    Accordion,
    Container,
    Typography,
    AccordionSummary,
    AccordionDetails,
    Stack,
} from "@mui/material";
import React from "react";
import ExperimentTable from "./experimentTable/experimentTable";
import { AssayTypeInfo, ExperimentInfo } from "@/lib/controllers/types";
import { ExpandMore } from "@mui/icons-material";

const AssaysGroupedByType: React.FC = () => {
    const experimentId = useExperimentId();
    const { data, isLoading, isError } = useExperimentInfo(experimentId);

    if (isLoading || isError || !data) {
        return <></>;
    }
    return (
        <Container sx={{ marginTop: 2, minWidth: "100%" }}>

            {data.assayTypes.map((type : AssayTypeInfo) => {
                const typeId: number = type.id;
                return (
                    <Accordion key={typeId}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>
                                Assays of type {type.assayType.name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ExperimentTable
                                assayFilter={(experimentInfo: ExperimentInfo) =>
                                    experimentInfo.assays.filter(
                                        (assay) => assay.assayTypeId === typeId
                                    )
                                }
                            />
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Container>
    );
};

export default AssaysGroupedByType;
