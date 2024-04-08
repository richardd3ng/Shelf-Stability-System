import React, { useContext, useState } from "react"
import CloseableModal from "../shared/closeableModal"
import { UtilizationReportContext } from "@/lib/context/agendaPage/utilizationReportContext"
import { Stack, Typography, Button } from "@mui/material";
import { MyDatePicker } from "../shared/myDatePicker";
import { LocalDate } from "@js-joda/core";
import { fetchUtilizationData } from "@/lib/controllers/assayController";
import { UtilizationReportRow } from "@/lib/controllers/types";
import { generateExcelUtilizationReport } from "@/lib/generateExcelUtilizationReport";
import { useGenerateLabUtilReport } from "@/lib/hooks/useGenerateLabUtilReport";

export const UtilReportModal : React.FC = () => {
    const {isChoosingDates, setIsChoosingDates} = useContext(UtilizationReportContext);
    const [startDate, setStartDate] = useState<LocalDate>(LocalDate.now());
    const [endDate, setEndDate] = useState<LocalDate>(LocalDate.now());
    const {mutate : fetchUtilizationDataAndGenerateExcelReport} = useGenerateLabUtilReport();
    const canSubmit = endDate.compareTo(startDate) > 0;
    return (
        <CloseableModal open={isChoosingDates} closeFn={() => setIsChoosingDates(false)} title="Lab Utilization Report">
            <Stack direction="column" gap={3}>
                <Typography>Select the dates</Typography>
                <MyDatePicker label="Start Date" value={startDate} onChange={(d : LocalDate | null) => {
                    if (d){
                        setStartDate(d);
                    }
                }}/>
                <MyDatePicker label="End Date" value={endDate} onChange={(d : LocalDate | null) => {
                    if (d){
                        setEndDate(d);
                    }
                }}/>
                {
                    canSubmit 
                    ?
                    null
                    :
                    <Typography>
                        End date must come after the start date
                    </Typography>
                }
                <Button disabled={!canSubmit} variant="contained" color="primary" style={{textTransform : "none"}} onClick={() => fetchUtilizationDataAndGenerateExcelReport({startDate, endDate})}>
                    Generate Excel Report
                </Button>
            </Stack>

        </CloseableModal>
    )

}