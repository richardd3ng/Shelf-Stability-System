import { useExperimentInfo } from "@/lib/hooks/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/useExperimentId"
import { Container, Typography } from "@mui/material"

export const ExperimentHeader = () => {
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    return (
        <Container>
            <Typography align="center" variant="h3" style={{marginBottom : 8, marginTop : 8}}>Experiment {experimentId}</Typography>
            {data 
                ?
                <>
                    <Typography align="center" variant="h4" style={{marginBottom : 8}}>{data ? data.experiment.title : null}</Typography>
                    <Typography align="center" variant="h5" style={{marginBottom : 8}}>{data ? data.experiment.description : null}</Typography>
                    <Typography align="center" variant="h5" style={{marginBottom : 8}}>{data ? "Start date: " + data.experiment.start_date.toLocaleDateString() : null}</Typography>
                </>
                : 
                null
            }
            
        </Container>
        
    )
}