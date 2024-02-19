import { createContext } from "react";

interface AssayEditingContextType {
    isEditing: boolean;
    setIsEditing: (b: boolean) => void;
    assayIdBeingEdited: number;
    setAssayIdBeingEdited: (n: number) => void;
}

export const AssayEditingContext = createContext<AssayEditingContextType>({
    isEditing: false,
    setIsEditing: (_b: boolean) => {},
    assayIdBeingEdited: 0,
    setAssayIdBeingEdited: (_n: number) => {},
});
