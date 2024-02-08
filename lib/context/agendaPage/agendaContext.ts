import { AssayInfo } from "@/lib/controllers/types";
import { createContext } from "react";

interface AgendaPageContextType {
    reload : () => void;
    rows : AssayInfo[];
    setRows : (newRows : AssayInfo[]) => void;
    isEditing : boolean;
    setIsEditing : (b : boolean) => void;
    assayIdBeingEdited : number;
    setAssayIdBeingEdited : (n : number) => void;


}

export const AgendaContext = createContext<AgendaPageContextType>({
    reload : () => {},
    rows : [],
    setRows : (newRows : AssayInfo[]) => {},
    isEditing : false,
    setIsEditing : (b : boolean) => {},
    assayIdBeingEdited : 0,
    setAssayIdBeingEdited : (n : number) => {}
})
