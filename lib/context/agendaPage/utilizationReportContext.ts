import { AssayAgendaInfo } from "@/lib/controllers/types";
import { createContext } from "react";

interface UtilizationReportContextType {
    isChoosingDates : boolean;
    setIsChoosingDates : (b : boolean) => void;
}

export const UtilizationReportContext = createContext<UtilizationReportContextType>({
    isChoosingDates : false,
    setIsChoosingDates : (b : boolean) => {}
});
