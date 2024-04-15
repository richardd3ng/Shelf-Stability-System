import React, { useContext, useState } from "react"
import { UtilizationReportContext } from "@/lib/context/agendaPage/utilizationReportContext"
import { Stack, Typography, Button } from "@mui/material";
import { MyDatePicker } from "@/components/shared/myDatePicker";
import { LocalDate } from "@js-joda/core";
import { fetchUtilizationData } from "@/lib/controllers/assayController";
import { UtilizationReportRow } from "@/lib/controllers/types";
import { generateExcelUtilizationReport } from "@/lib/generateExcelUtilizationReport";
import { useGenerateLabUtilReport } from "@/lib/hooks/useGenerateLabUtilReport";
import { Container } from "@mui/material";
import Layout from "@/components/shared/layout";


export default function UtilizationPage() {
    const {isChoosingDates, setIsChoosingDates} = useContext(UtilizationReportContext);
    const [startDate, setStartDate] = useState<LocalDate>(LocalDate.now());
    const [endDate, setEndDate] = useState<LocalDate>(LocalDate.now());
    const {mutate : fetchUtilizationDataAndGenerateExcelReport} = useGenerateLabUtilReport();
    const canSubmit = endDate.compareTo(startDate) > 0;
    return (
        <Layout>
            <Container maxWidth="sm" style={{backgroundColor : "white"}}>
                <Stack direction="column" gap={3}>
                    <Typography variant="h3">Lab Utilization Report</Typography>
                    <Typography>
                        IMPORTANT: For the dates you select, the report will have data for all assays scheduled within the first Sunday before or equal to your start date, up to the first Sunday after or equal to your end date.
                    </Typography>
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
                    <Button disabled={!canSubmit} variant="contained" color="primary" style={{textTransform : "none", marginBottom : 4}} onClick={() => fetchUtilizationDataAndGenerateExcelReport({startDate, endDate})}>
                        Generate Excel Report
                    </Button>
                </Stack>
            </Container>
        </Layout>

    )
}