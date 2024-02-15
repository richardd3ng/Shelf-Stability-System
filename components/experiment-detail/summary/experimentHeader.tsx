import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { ExperimentEditorModal } from "../modifications/editorModals/experimentEditorModal";
import { ExperimentEditingContext } from "@/lib/context/experimentDetailPage/experimentEditingContext";
import { useState } from "react";
import dayjs from "dayjs";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const router = useRouter();
    const [isEditingExperimentMetadata, setIsEditingExperimentMetadata] =
        useState<boolean>(false);
    return (
        <Container>
            {data ? (
                <>
                    <ExperimentEditingContext.Provider
                        value={{
                            isEditing: isEditingExperimentMetadata,
                            setIsEditing: setIsEditingExperimentMetadata,
                        }}
                    >
                        <Container
                            style={{
                                marginTop: 16,
                                marginBottom: 16,
                                border: "1px black solid",
                            }}
                        >
                            <Typography
                                align="center"
                                variant="h4"
                                style={{ marginBottom: 8, marginTop: 8 }}
                            >
                                {data ? data.experiment.title : null}
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                style={{ marginBottom: 8 }}
                            >
                                {data ? data.experiment.description : null}
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                style={{ marginBottom: 8 }}
                            >
                                Started{" "}
                                {data
                                    ? dayjs
                                          .utc(data.experiment.start_date)
                                          .format("YYYY-MM-DD")
                                    : null}{" "}
                                by Richard Deng
                            </Typography>
                            {router.pathname.endsWith("report") ? null : (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: -32 }}
                                        onClick={() =>
                                            setIsEditingExperimentMetadata(true)
                                        }
                                    >
                                        <Typography>Edit Metadata</Typography>
                                    </Button>
                                    <ExperimentEditorModal />
                                </>
                            )}
                        </Container>
                    </ExperimentEditingContext.Provider>
                </>
            ) : null}
        </Container>
    );
};
