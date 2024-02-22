import { INVALID_ASSAY_RESULT_ID } from "@/lib/api/apiHelpers";
import { createContext } from "react";

interface AssayResultEditingContextType {
    isEditing: boolean;
    setIsEditing: (b: boolean) => void;
    assayResultIdBeingEdited: number;
    setAssayResultIdBeingEdited: (n: number) => void;
}

export const AssayResultEditingContext =
    createContext<AssayResultEditingContextType>({
        isEditing: false,
        setIsEditing: (_b: boolean) => {},
        assayResultIdBeingEdited: INVALID_ASSAY_RESULT_ID,
        setAssayResultIdBeingEdited: (_n: number) => {},
    });
