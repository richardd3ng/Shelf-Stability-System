import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { ExperimentAdditionsContext } from "@/lib/context/experimentDetailPage/experimentAdditionsContext";
import { useMutationToCreateAssay, useMutationToCreateCondition } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { FormControl, InputLabel, Stack, TextField, Select, MenuItem} from "@mui/material";
import { useContext, useState } from "react";
import MultiSelectDropdown from "@/components/shared/multi-select-dropdown";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createAssays } from "@/lib/controllers/assayController";

export const NewAssayModal = () => {
    const {isAddingAssay, setIsAddingAssay} = useContext(ExperimentAdditionsContext);
    const experimentId = useExperimentId();
    const {data} = useExperimentInfo(experimentId);
    const [name, setName] = useState<string>("");
    const [conditionId, setConditionId] = useState<number>(-1);
    const [assayTyepId, setAssayTypeId] = useState<number>(-1);
    const [targetDate, setTargetDate] = useState<Date>(new Date(Date.now()));
    const { isPending, isError, error, mutate : createAssayInDB} = useMutationToCreateAssay();

    const onSubmit = () => {
        createAssayInDB(
            {
                experimentId : experimentId,
                conditionId : conditionId,
                typeId : assayTyepId,
                target_date : targetDate,
                result : null
            }
        )
    }
    return (
        <CloseableModal open={isAddingAssay} closeFn={() => setIsAddingAssay(false)} title={"Add New Assay"}>
            {data 
            ? 
            <Stack gap={1}>
                <FormControl fullWidth>
                    <InputLabel id="Condition Select Label">Condition</InputLabel>
                    <Select labelId="Condition Select Label" id="Condition Selection" value={conditionId} label="Condition" onChange={(e)=> {
                        if (typeof e.target.value === "number"){
                            setConditionId(e.target.value)
                        }
                    }}>
                        {data.conditions.map((condition) => <MenuItem key={condition.id} value={condition.id}>{condition.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="Assay Type Select Label">Assay Type</InputLabel>
                    <Select labelId="Assay Type Select Label" id="Assay Type Selection" value={assayTyepId} label="Assay Type" onChange={(e)=> {
                        if (typeof e.target.value === "number"){
                            setAssayTypeId(e.target.value);
                        }
                    }}>
                        {data.assayTypes.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker timezone="UTC" label="Target Date" onChange={(newDate : Dayjs | null) => {
                        if (newDate){
                            setTargetDate(newDate.toDate())
                        }
                    }}>

                    </DatePicker>
                </LocalizationProvider>

            </Stack>
            : 
            null}

            <ButtonWithLoadingAndError text="Submit" isLoading={isPending} isError={isError} error={error} onSubmit={onSubmit}/>
        </CloseableModal>
    );
}
