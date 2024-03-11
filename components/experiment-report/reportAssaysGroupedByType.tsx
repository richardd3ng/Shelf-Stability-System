import { ExperimentInfo } from "@/lib/controllers/types";
import { assayTypeNameToId } from "@/lib/controllers/assayTypeController";
import { Stack, Typography } from "@mui/material";
import ReportTable from "./experimentTableReport/reportTable";
import { getAssayTypesCoveredByAssays } from "../experiment-detail/assaysGroupedByType";

interface ReportAssaysGroupedByTypeProps {
    experimentInfo: ExperimentInfo;
}

const ReportAssaysGroupedByType: React.FC<ReportAssaysGroupedByTypeProps> = (
    props: ReportAssaysGroupedByTypeProps
) => {
    return (
        <Stack gap={2}>
            <Stack sx={{ "@media print": { breakInside: "avoid" } }}>
                <Typography variant="h6">Assay Schedule</Typography>
                <ReportTable
                    experimentInfo={props.experimentInfo}
                    assayFilter={(experimentInfo: ExperimentInfo) =>
                        experimentInfo.assays
                    }
                />
            </Stack>
            {getAssayTypesCoveredByAssays(props.experimentInfo.assays).map(
                (name: string) => {
                    const typeId: number = assayTypeNameToId(name);
                    return (
                        <Stack
                            key={typeId}
                            sx={{ "@media print": { breakInside: "avoid" } }}
                        >
                            <Typography>Assays of type {name}</Typography>
                            <ReportTable
                                experimentInfo={props.experimentInfo}
                                assayFilter={(experimentInfo: ExperimentInfo) =>
                                    experimentInfo.assays.filter(
                                        (assay) => assay.assayTypeId === typeId
                                    )
                                }
                            />
                        </Stack>
                    );
                }
            )}
        </Stack>
    );
};

export default ReportAssaysGroupedByType;
