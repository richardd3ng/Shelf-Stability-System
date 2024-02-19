// import { AssaysGroupedByType } from "@/components/experiment-detail/assaysGroupedByType";
import Layout from "@/components/shared/layout";
import { AssayEditingContext } from "@/lib/context/shared/assayEditingContext";
import { useState } from "react";
import { AssayEditorModal } from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import { ExperimentHeader } from "@/components/experiment-detail/summary/experimentHeader";
import { Container, Typography, Button, Stack } from "@mui/material";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useRouter } from "next/router";
// import { DeleteExperimentButton } from "@/components/experiment-detail/deleteExperimentButton";
import { useMutationToDeleteExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import ExperimentTable from "@/components/experiment-detail/experimentTable/experimentTable";

export default function ExperimentPage() {
    const [isEditingAssay, setIsEditingAssay] = useState<boolean>(false);
    const [assayIdBeingEdited, setAssayIdBeingEdited] = useState<number>(0);
    const experimentId = useExperimentId();
    const router = useRouter();
    const {
        mutate: deleteExperiment,
        isPending,
        isError,
        error,
    } = useMutationToDeleteExperiment();

    return (
        <Layout>
            <AssayEditingContext.Provider
                value={{
                    isEditing: isEditingAssay,
                    setIsEditing: setIsEditingAssay,
                    assayIdBeingEdited,
                    setAssayIdBeingEdited,
                }}
            >
                <ExperimentHeader />
                <ExperimentTable />
                {/* <AssayEditorModal /> */}
                {/* <AssaysGroupedByType /> */}
                <Container
                    maxWidth="sm"
                    style={{ marginTop: 24, marginBottom: 24 }}
                >
                    <Stack>
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
                        {/* <DeleteExperimentButton /> */}
                    </Stack>
                </Container>
            </AssayEditingContext.Provider>
        </Layout>
    );
}
