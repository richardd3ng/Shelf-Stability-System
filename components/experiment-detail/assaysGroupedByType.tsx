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
import React, { useEffect } from "react";
import ExperimentTable from "./experimentTable/experimentTable";
import { ExperimentInfo } from "@/lib/controllers/types";
import { ExpandMore } from "@mui/icons-material";
import {
    assayTypeNameToId,
    getDistinctAssayTypes,
} from "@/lib/controllers/assayTypeController";

const AssaysGroupedByType: React.FC = () => {
    const experimentId = useExperimentId();
    const { data, isLoading, isError, error } = useExperimentInfo(experimentId);
    const [assayTypesCovered, setAssayTypesCovered] = React.useState<string[]>(
        []
    );
    useEffect(() => {
        if (!data) {
            return;
        }
        setAssayTypesCovered(
            getDistinctAssayTypes().filter((type: string) =>
                data.assays.some(
                    (assay) => assay.type === assayTypeNameToId(type)
                )
            )
        );
    }, [data]);
    if (isLoading || isError || !data) {
        return <></>;
    }
    return (
        <Container sx={{ marginTop: 2 }}>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">All Assays</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        <ExperimentTable
                            assayFilter={(experimentInfo: ExperimentInfo) =>
                                experimentInfo.assays
                            }
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
            {assayTypesCovered.map((name: string) => {
                const typeId: number = assayTypeNameToId(name);
                return (
                    <Accordion key={typeId}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>Assays of type {name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ExperimentTable
                                assayFilter={(experimentInfo: ExperimentInfo) =>
                                    experimentInfo.assays.filter(
                                        (assay) => assay.type === typeId
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
