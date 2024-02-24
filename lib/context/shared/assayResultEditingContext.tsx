import { createContext } from "react";
import { INVALID_ASSAY_RESULT_ID } from "@/lib/api/apiHelpers";

interface AssayResultEditingContextType {
    id: number;
    setId: (id: number) => void;
    isEditing: boolean;
    setIsEditing: (b: boolean) => void;
}

const AssayResultEditingContext = createContext<AssayResultEditingContextType>({
    id: INVALID_ASSAY_RESULT_ID,
    setId: (_id: number) => {},
    isEditing: false,
    setIsEditing: (_b: boolean) => {},
});

export default AssayResultEditingContext;
