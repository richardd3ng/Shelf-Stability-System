import { createContext } from "react";

interface ExperimentEditingContextType {
    isEditing : boolean;
    setIsEditing : (b : boolean) => void;
}

export const ExperimentEditingContext = createContext<ExperimentEditingContextType>({
    isEditing : false,
    setIsEditing : (b : boolean ) => {},
})
