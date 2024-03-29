import { Box, Stack, Typography } from "@mui/material";
import { ExperimentInfo } from "@/lib/controllers/types";

interface ReportHeaderProps {
    experimentInfo: ExperimentInfo;
    owner: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = (
    props: ReportHeaderProps
) => {
    return (
        <Box
            sx={{
                border: "1px solid #ccc",
                padding: 1,
                borderRadius: 1,
                position: "relative",
                display: "flex",
            }}
        >
            <Typography>
                <strong>{`Experiment #${props.experimentInfo.experiment.id}`}</strong>
            </Typography>

            <Stack sx={{ width: "50%" }}>
                {props.experimentInfo.experiment.isCanceled && (
                    <Typography sx={{ color: "red" }}>
                        <strong>{"[Canceled]"}</strong>
                    </Typography>
                )}
                <Typography>
                    <strong>{`Title:`}</strong>{" "}
                    {props.experimentInfo.experiment.title}
                </Typography>
                <Typography>
                    <strong>{`Description:`}</strong>{" "}
                    {props.experimentInfo.experiment.description}
                </Typography>
                <Typography>
                    <strong>{`Owner:`}</strong> {props.owner}
                </Typography>
                <Typography>
                    <strong>{`Start Date:`}</strong>{" "}
                    {props.experimentInfo.experiment.startDate.toString()}
                </Typography>
            </Stack>
            <Stack sx={{ width: "50%" }}>
                <Typography>
                    <strong>{`Assay Types:`}</strong>{" "}
                    {props.experimentInfo.assayTypes
                        .map((type) => type.assayType.name)
                        .join(", ")}
                </Typography>
                <Typography>
                    <strong>{`Conditions:`}</strong>{" "}
                    {props.experimentInfo.conditions
                        .map((condition) => condition.name)
                        .join(", ")}
                </Typography>
            </Stack>
        </Box>
    );
};

export default ReportHeader;
