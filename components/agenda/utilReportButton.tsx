import React, { useState } from "react";
import GenerateReportIconButton from "../shared/generateReportIconButton";
import { UtilizationReportContext } from "@/lib/context/agendaPage/utilizationReportContext";
import { UtilReportModal } from "./utilReportModal";

export const UtilReportButton : React.FC = () => {
    const [isChoosingDates, setIsChoosingDates] = useState<boolean>(false);
    return (
        <UtilizationReportContext.Provider value={{isChoosingDates : isChoosingDates, setIsChoosingDates : setIsChoosingDates}}>
            <GenerateReportIconButton text="Generate Lab Utilization Report" size="large" onClick={() => setIsChoosingDates(true)}/>
            <UtilReportModal/>
        </UtilizationReportContext.Provider>
    )
}