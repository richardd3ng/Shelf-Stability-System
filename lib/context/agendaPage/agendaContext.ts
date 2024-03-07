import { AssayAgendaInfo } from "@/lib/controllers/types";
import { createContext } from "react";

interface AgendaPageContextType {
    reload: () => void;
    rows: AssayAgendaInfo[];
    setRows: (newRows: AssayAgendaInfo[]) => void;
}

export const AgendaContext = createContext<AgendaPageContextType>({
    reload: () => {},
    rows: [],
    setRows: (_newRows: AssayAgendaInfo[]) => {},
});
