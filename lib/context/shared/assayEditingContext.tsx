import { createContext } from "react";
import { Assay } from "@prisma/client";

interface AssayEditingContextType {
    assay?: Assay;
    setAssay: (assay: Assay) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const AssayEditingContext = createContext<AssayEditingContextType>({
    setAssay: (_assay: Assay) => {},
    isEditing: false,
    setIsEditing: (_isEditing: boolean) => {},
});

export default AssayEditingContext;