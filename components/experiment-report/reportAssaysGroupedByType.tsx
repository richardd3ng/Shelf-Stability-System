import { AssayTypeInfo, ExperimentInfo } from "@/lib/controllers/types";
import { Stack, Typography } from "@mui/material";
import ReportTable from "./experimentTableReport/reportTable";
import { assayTypeHasAssays } from "../experiment-detail/assays/assaysGroupedByType";

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
            {props.experimentInfo.assayTypes.map((type: AssayTypeInfo) => {
                const typeId: number = type.id;
                if (assayTypeHasAssays(props.experimentInfo, typeId)) {
                    return (
                        <Stack
                            key={typeId}
                            sx={{ "@media print": { breakInside: "avoid" } }}
                        >
                            <Typography>
                                Assays of type {type.assayType.name}
                            </Typography>
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
            })}
        </Stack>
    );
};

export default ReportAssaysGroupedByType;
