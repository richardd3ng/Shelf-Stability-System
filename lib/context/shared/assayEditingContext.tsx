import { INVALID_ASSAY_ID } from "@/lib/api/apiHelpers";
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
    assayIdBeingEdited: INVALID_ASSAY_ID,
    setAssayIdBeingEdited: (_n: number) => {},
});
