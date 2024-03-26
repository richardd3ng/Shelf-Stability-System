import { createContext } from "react";
import { INVALID_ASSAY_TYPE_ID } from "@/lib/api/apiHelpers";

interface AssayTypeEditingContextType {
    assayTypeIdBeingEdited: number;
    setAssayTypeIdBeingEdited: (id: number) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const AssayTypeEditingContext = createContext<AssayTypeEditingContextType>({
    assayTypeIdBeingEdited: INVALID_ASSAY_TYPE_ID,
    setAssayTypeIdBeingEdited: (_id: number) => {},
    isEditing: false,
    setIsEditing: (_isEditing: boolean) => {},
});

export default AssayTypeEditingContext;
