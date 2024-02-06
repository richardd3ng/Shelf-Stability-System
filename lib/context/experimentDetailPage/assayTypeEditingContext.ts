import { createContext } from "react";

interface AssayTypeEditingContextType {
    isEditing : boolean;
    setIsEditing : (b : boolean) => void;
    assayTypeIdBeingEdited : number;
    setAssayTypeIdBeingEdited : (n : number) => void;
    
}

export const AssayTypeEditingContext = createContext<AssayTypeEditingContextType>({
    isEditing : false,
    setIsEditing : (b : boolean ) => {},
    assayTypeIdBeingEdited : 0,
    setAssayTypeIdBeingEdited : (n : number) => {}
})
