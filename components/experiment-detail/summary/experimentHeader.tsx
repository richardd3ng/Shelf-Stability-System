import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Container, Typography } from "@mui/material";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    // make the number smaller next to the title
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
                        Started {data?.experiment.start_date.toString() ?? null}{" "}
                        by Richard Deng
                    </Typography>
                </Container>
            ) : null}
        </Container>
    );
};
