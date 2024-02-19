import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import dayjs from "dayjs";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const router = useRouter();
    return (
        <Container>
            {data ? (
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
                </Container>
            ) : null}
        </Container>
    );
};
