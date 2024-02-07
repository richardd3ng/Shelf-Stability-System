
import { ErrorMessage } from "@/components/shared/errorMessage";
import { LoadingContainer } from "@/components/shared/loading";
import { ExperimentInfo } from "@/lib/controllers/types";
import { INVALID_EXPERIMENT_ID, useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {Typography, Container, Table, TableBody, TableRow, TableCell, Stack, Button} from "@mui/material";
import { Assay, AssayType } from "@prisma/client";
import { getDateAtMidnight, getNumWeeksAfterStartDate } from "@/lib/datesUtils";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import React, { useContext } from "react";
import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";


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


type AssayFilter = (experimentInfo : ExperimentInfo) => Assay[];
export interface AssayComponentProps{
    assay : Assay;
    experimentInfo : ExperimentInfo;
}

interface ExperimentTableProps{
    assayFilter : AssayFilter;
    componentForAssay : React.FC<AssayComponentProps>; 
}



export const ExperimentTable : React.FC<ExperimentTableProps> = (props : ExperimentTableProps) => {
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId); 
    const {setIsEditing, setAssayIdBeingEdited} = useContext(AssayEditingContext);
    if (isLoading || experimentId === INVALID_EXPERIMENT_ID){
        return <LoadingContainer/>
    } else if (isError){
        return <ErrorMessage message="An error occurred"/>
    } else if (!data || !data.experiment || !data.assays || !data.conditions){
        return null;
    } else {
        let assays = props.assayFilter(data);
        let experimentStartDate = data.experiment.start_date;
        let weekNums = getAllWeeksCoveredByAssays(assays, experimentStartDate).sort((a : number, b : number) => a - b);
        let conditions = data.conditions.sort();
        return (
            <Container>
                <Table>
                    <TableBody> 
                        <TableRow>
                            <TableCell></TableCell>
                            {data.conditions.sort().map((condition) =>
                                <TableCell key={condition.id}>
                                    <Typography align="center">{condition.name}</Typography>
                                </TableCell>)}
                        </TableRow>
                        {weekNums.map((week) => 
                            <TableRow key={week}>
                                <TableCell><Typography>Week {week}</Typography></TableCell>
                                {data.conditions.sort().map((condition) => {
                                    let cellAssays = getAssaysForWeekAndCondition(assays, experimentStartDate, week, condition.id)
                                    return (
                                        <TableCell key={condition.id} style={{border : "1px solid black"}}>
                                            <Stack>
                                                {cellAssays.map((assay) => <props.componentForAssay assay={assay} experimentInfo={data} key={assay.id}/>)}
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

ExperimentTable.defaultProps = {
    assayFilter : (experimentInfo : ExperimentInfo) => experimentInfo.assays
}
