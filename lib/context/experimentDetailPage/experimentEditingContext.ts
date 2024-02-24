import { createContext } from "react";

interface ExperimentDetailContextType {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const ExperimentDetailContext = createContext<ExperimentDetailContextType>({
    isEditing: false,
    setIsEditing: (_isEditing: boolean) => {},
});

export default ExperimentDetailContext;
