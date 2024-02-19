import { AssayInfo } from "@/lib/controllers/types";
import { createContext } from "react";

interface AgendaPageContextType {
    reload: () => void;
    rows: AssayInfo[];
    setRows: (newRows: AssayInfo[]) => void;
}

export const AgendaContext = createContext<AgendaPageContextType>({
    reload: () => {},
    rows: [],
    setRows: (_newRows: AssayInfo[]) => {},
});
