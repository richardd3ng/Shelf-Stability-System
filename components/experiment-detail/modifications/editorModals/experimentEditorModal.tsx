import { CloseableModal } from "@/components/shared/closeableModal"
import { AssayTypeEditingContext } from "@/lib/context/experimentDetailPage/assayTypeEditingContext"
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useMutationToDeleteAssayType } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useMutationToUpdateAssayType, useMutationToUpdateExperiment } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { Typography, TextField, Stack } from "@mui/material";
import { useContext, useState, useEffect } from "react"
import { ButtonWithConfirmationLoadingAndError } from "@/components/shared/buttonWithConfirmationLoadingAndError";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { ExperimentEditingContext } from "@/lib/context/experimentDetailPage/experimentEditingContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { checkIfAnAssayHasResults } from "../../../../lib/checkIfAnAssayHasResults";
import { MyDatePicker } from "@/components/shared/myDatePicker";

export const ExperimentEditorModal = () => {
    const {isEditing, setIsEditing} = useContext(ExperimentEditingContext);
    const {mutate : updateExperiment, isPending : isUpdating, isError : isErrorUpdating, error : errorUpdating} = useMutationToUpdateExperiment();
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const DEFAULT_RESULT = "";
    const [newTitle, setNewTitle] = useState<string>(DEFAULT_RESULT);
    const [newDescription, setNewDescription] = useState<string | null>(null);
    const [newStartDate, setNewStartDate] = useState<Date>(new Date(Date.now()));

    useEffect(() => {
        if (data) {
            const experiment = data.experiment;
            setNewTitle(experiment.title);
            setNewDescription(experiment.description);
            setNewStartDate(experiment.start_date);
        } 
    }, [data]);

    
    return (
        <CloseableModal open={isEditing} closeFn={() => setIsEditing(false)} title={"Edit Experiment"}>
            <Stack>
                <TextField value={newTitle} label="Title" onChange={(e) => setNewTitle(e.target.value)} style={{marginBottom : 8, marginLeft : 4, marginRight : 4}}></TextField>
                <TextField value={newDescription} label="Description" onChange={(e) => setNewDescription(e.target.value)} style={{marginBottom : 8, marginLeft : 4, marginRight : 4}}></TextField>
                {
                    checkIfAnAssayHasResults(data,  () => true)
                    ?
                    <Typography>Cannot modify the start date, because assay results have been recorded</Typography>
                    : 
                    <MyDatePicker label="Start Date" setDate={setNewStartDate} date={newStartDate} />
                }
                
                <ButtonWithLoadingAndError text="Submit" isError={isErrorUpdating} isLoading={isUpdating} error={errorUpdating} onSubmit={
                    () => {
                        updateExperiment({newTitle, newDescription, newStartDate, shouldUpdateStartDate : !checkIfAnAssayHasResults(data, () => true), experimentId : experimentId })
                    }
                }/>
            </Stack>
        </CloseableModal>
    )
}

