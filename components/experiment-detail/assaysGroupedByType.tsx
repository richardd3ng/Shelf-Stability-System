import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    Accordion,
    Button,
    Container,
    Typography,
    AccordionSummary,
    AccordionDetails,
    Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import { LoadingContainer } from "../shared/loading";
import { ErrorMessage } from "../shared/errorMessage";
import ExperimentTable from "./experimentTable/experimentTable";
import { ExperimentInfo } from "@/lib/controllers/types";
import { ExpandMore } from "@mui/icons-material";
import {
    assayTypeNameToId,
    getDistinctAssayTypes,
} from "@/lib/controllers/assayTypeController";
import { getErrorMessage } from "@/lib/api/apiHelpers";

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
    if (isLoading) {
        return <LoadingContainer />;
    } else if (isError || !data) {
        return <ErrorMessage message={getErrorMessage(error)} />;
    } else {
        return (
            <Container style={{ marginTop: 24 }}>
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
                                readOnly={false}
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>
                {assayTypesCovered.map((name: string) => {
                    const typeId: number = assayTypeNameToId(name);
                    return (
                        <Accordion key={typeId}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>
                                    Assays Results for Type {name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ExperimentTable
                                    assayFilter={(
                                        experimentInfo: ExperimentInfo
                                    ) =>
                                        experimentInfo.assays.filter(
                                            (assay) => assay.type === typeId
                                        )
                                    }
                                    readOnly={true}
                                />
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Container>
        );
    }
};

export default AssaysGroupedByType;
