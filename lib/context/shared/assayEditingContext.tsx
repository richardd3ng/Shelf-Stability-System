import { createContext } from "react";
import { INVALID_ASSAY_ID } from "@/lib/api/apiHelpers";

interface AssayEditingContextType {
    id: number;
    setId: (id: number) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const AssayEditingContext = createContext<AssayEditingContextType>({
    id: INVALID_ASSAY_ID,
    setId: (_id: number) => {},
    isEditing: false,
    setIsEditing: (_isEditing: boolean) => {},
});

export default AssayEditingContext;