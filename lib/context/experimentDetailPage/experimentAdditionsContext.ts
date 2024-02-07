import { createContext } from "react";


interface ExperimentAdditionsContextType {
    isAddingCondition: boolean;
    setIsAddingCondition: (b: boolean) => void;
    isAddingAssayType: boolean;
    setIsAddingAssayType: (b: boolean) => void;
    isAddingAssay: boolean;
    setIsAddingAssay: (b: boolean) => void;
}

export const ExperimentAdditionsContext = createContext<ExperimentAdditionsContextType>({
    isAddingCondition: false,
    setIsAddingCondition: (b: boolean) => { },
    isAddingAssayType: false,
    setIsAddingAssayType: (b: boolean) => { },
    isAddingAssay: false,
    setIsAddingAssay: (b: boolean) => { }
});
