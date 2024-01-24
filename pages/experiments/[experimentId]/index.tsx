
import { ErrorMessage } from "@/components/shared/errorMessage";
import { LoadingContainer } from "@/components/shared/loading";
import { fetchExperimentInfoThroughAPI } from "@/lib/controllers/fetchExperimentInfo";
import { ExperimentInfo } from "@/lib/controllers/types";
import { INVALID_EXPERIMENT_ID, useExperimentId } from "@/lib/hooks/useExperimentId";
import {Typography, Container, Table, TableBody, TableRow, TableCell, Stack} from "@mui/material";
import { Assay } from "@prisma/client";
import { useQuery } from "react-query";
import { getDateAtMidnight, getNumWeeksAfterStartDate } from "@/lib/datesUtils";


export const getAssaysForWeekAndCondition = (assays : Assay[], experimentStartDate : Date, weekNum : number, conditionId : number) : Assay[] => {
    return assays.filter((assay) => {
        let weekDiff = getNumWeeksAfterStartDate(getDateAtMidnight(experimentStartDate), getDateAtMidnight(assay.target_date));
        return (weekDiff === weekNum && assay.conditionId === conditionId)
    })
}

export const getAllWeeksCoveredByAssays = (assays : Assay[], experimentStartDate : Date) : number[] => {
    let weeks : number[] = [];
    assays.forEach((assay) => {
        let weekNum = getNumWeeksAfterStartDate(getDateAtMidnight(experimentStartDate), getDateAtMidnight(assay.target_date));
        if (!weeks.includes(weekNum)){
            weeks.push(weekNum);
        }
    })
    return weeks;
}



export default function ExperimentPage() {
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useQuery<ExperimentInfo>(["fetch experiment info", experimentId], () => fetchExperimentInfoThroughAPI(experimentId));
	if (isLoading || experimentId === INVALID_EXPERIMENT_ID){
        return <LoadingContainer/>
    } else if (isError){
        return <ErrorMessage message="An error occurred"/>
    } else if (!data || !data.experiment || !data.assays || !data.conditions){
        return null;
    } else {
        let assays = data.assays;
        let experimentStartDate = data.experiment.start_date;
        let weekNums = getAllWeeksCoveredByAssays(assays, experimentStartDate);
        let conditions = data.conditions;
        return (
            <Container>
                <Typography>Hi these are the details of experiment {experimentId}</Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            {conditions.map((condition) =>
                                <TableCell key={condition.id}>
                                    {condition.name}
                                </TableCell>)}
                        </TableRow>
                        {weekNums.map((week) => 
                            <TableRow key={week}>
                                {conditions.map((condition) => {
                                    let cellAssays = getAssaysForWeekAndCondition(assays, experimentStartDate, week, condition.id)
                                    return (
                                        <TableCell key={condition.id}>
                                            <Stack>
                                                {cellAssays.map((assay) => 
                                                    <Typography key={assay.id}>
                                                        {assay.typeId}
                                                    </Typography>)
                                                }
                                            </Stack>

                                        </TableCell>
                                    )
                                }
                                    
                                )}
                            </TableRow>
                        )}
                        
                    </TableBody>
                </Table>
            </Container>
        )
    }
    
}