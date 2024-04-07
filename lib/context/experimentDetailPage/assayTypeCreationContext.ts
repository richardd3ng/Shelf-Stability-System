import { createContext } from "react";
import { INVALID_ASSAY_TYPE_ID } from "@/lib/api/apiHelpers";

interface AssayTypeCreationContextType {
    isCreating : boolean;
    setIsCreating : (b : boolean) => void;
}

const AssayTypeCreationContext = createContext<AssayTypeCreationContextType>({
    isCreating : false,
    setIsCreating: (b : boolean) => {},
});

export default AssayTypeCreationContext;
