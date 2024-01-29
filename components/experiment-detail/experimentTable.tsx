
import { ErrorMessage } from "@/components/shared/errorMessage";
import { LoadingContainer } from "@/components/shared/loading";
import { ExperimentInfo } from "@/lib/controllers/types";
import { INVALID_EXPERIMENT_ID, useExperimentId } from "@/lib/hooks/useExperimentId";
import {Typography, Container, Table, TableBody, TableRow, TableCell, Stack, Button} from "@mui/material";
import { Assay, AssayType } from "@prisma/client";
import { getDateAtMidnight, getNumWeeksAfterStartDate } from "@/lib/datesUtils";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailHooks";
import React, { useContext } from "react";
import { AssayEditingContext } from "@/lib/context/assayEditingContext";
import { AssayEditorModal } from "./assayEditorModal";


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

export const getNameForAssay = (assay : Assay, assayTypes : AssayType[]) : string => {
    let correspondingType = assayTypes.find(a => a.id === assay.typeId);
    if (correspondingType){
        return correspondingType.name;
    } else {
        return "?";
    }
}

type AssayFilter = (experimentInfo : ExperimentInfo) => Assay[];

interface ExperimentTableProps{
    assayFilter : AssayFilter;
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
        let weekNums = getAllWeeksCoveredByAssays(assays, experimentStartDate);
        let conditions = data.conditions;
        return (
            <Container>
                <Table>
                    <TableBody> 
                        <TableRow>
                            <TableCell></TableCell>
                            {conditions.map((condition) =>
                                <TableCell key={condition.id}>
                                    <Typography align="center">{condition.name}</Typography>
                                </TableCell>)}
                        </TableRow>
                        {weekNums.map((week) => 
                            <TableRow key={week}>
                                <TableCell><Typography>Week {week}</Typography></TableCell>
                                {conditions.map((condition) => {
                                    let cellAssays = getAssaysForWeekAndCondition(assays, experimentStartDate, week, condition.id)
                                    return (
                                        <TableCell key={condition.id} style={{border : "1px solid black"}}>
                                            <Stack>
                                                {cellAssays.map((assay) => 
                                                    <Button variant="contained" key={assay.id} style={{marginBottom : 2}} onClick={() => {
                                                        setAssayIdBeingEdited(assay.id);
                                                        setIsEditing(true);
                                                    }}>
                                                        <Typography key={assay.id}>
                                                            {getNameForAssay(assay, data.assayTypes)}
                                                        </Typography>
                                                    </Button>
                                                    )
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

ExperimentTable.defaultProps = {
    assayFilter : (experimentInfo : ExperimentInfo) => experimentInfo.assays
}