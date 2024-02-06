import { createContext } from "react";

interface AssayEditingContextType {
    isEditing : boolean;
    setIsEditing : (b : boolean) => void;
    assayIdBeingEdited : number;
    setAssayIdBeingEdited : (n : number) => void;
    
}

export const AssayEditingContext = createContext<AssayEditingContextType>({
    isEditing : false,
    setIsEditing : (b : boolean ) => {},
    assayIdBeingEdited : 0,
    setAssayIdBeingEdited : (n : number) => {}
})
