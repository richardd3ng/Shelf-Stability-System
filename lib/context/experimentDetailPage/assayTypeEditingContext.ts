import { createContext } from "react";
import { INVALID_ASSAY_TYPE_ID } from "@/lib/api/apiHelpers";

interface AssayTypeEditingContextType {
    assayTypeIdBeingEdited: number;
    setAssayTypeIdBeingEdited: (id: number) => void;
    name : string;
    setName : (s : string) => void;
    units : string | null;
    setUnits : (u : string | null) => void;
    description : string | null;
    setDescription : (d : string | null) => void;
    technicianId : number | null;
    setTechnicianId : (id : number | null) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const AssayTypeEditingContext = createContext<AssayTypeEditingContextType>({
    assayTypeIdBeingEdited: INVALID_ASSAY_TYPE_ID,
    setAssayTypeIdBeingEdited: (_id: number) => {},
    isEditing: false,
    setIsEditing: (_isEditing: boolean) => {},
    name : "",
    setName : (n : string) => {},
    units : null,
    setUnits : (u : string | null) => {},
    description : null,
    setDescription : (d : string | null) => {},
    technicianId : null,
    setTechnicianId : (id : number | null) => {}
});

export default AssayTypeEditingContext;
