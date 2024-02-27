import { createContext } from "react";
import { AssayResult } from "@prisma/client";

interface AssayResultEditingContextType {
    assayResult?: AssayResult;
    setAssayResult: (result: AssayResult | undefined) => void;
    isEditing: boolean;
    setIsEditing: (b: boolean) => void;
}

const AssayResultEditingContext = createContext<AssayResultEditingContextType>({
    setAssayResult: (_result: AssayResult | undefined) => {},
    isEditing: false,
    setIsEditing: (_b: boolean) => {},
});

export default AssayResultEditingContext;
