import { useExperimentInfo, useExperimentOwner } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Container, Typography } from "@mui/material";

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const {data : owner} = useExperimentOwner(experimentId);
    // make the number smaller next to the title
    return (
        <Container>
            {experimentInfo ? (
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
                        {experimentInfo ? experimentInfo.experiment.title : null}
                    </Typography>
                    <Typography
                        align="center"
                        variant="h5"
                        style={{ marginBottom: 8 }}
                    >
                        {experimentInfo ? experimentInfo.experiment.description : null}
                    </Typography>
                    { 
                        owner 
                        ? 
                        <Typography
                            align="center"
                            variant="h5"
                            style={{ marginBottom: 8 }}
                        >
                            Started {experimentInfo?.experiment.start_date.toString() ?? null}{" "}
                            by {owner.username}
                        </Typography>
                        : 
                        null
                    }
                    
                </Container>
            ) : null}
        </Container>
    );
};
