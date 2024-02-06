import { createContext } from "react";

interface ConditionEditingContextType {
    isEditing : boolean;
    setIsEditing : (b : boolean) => void;
    conditionIdBeingEdited : number;
    setConditionIdBeingEdited : (n : number) => void;
    
}

export const ConditionEditingContext = createContext<ConditionEditingContextType>({
    isEditing : false,
    setIsEditing : (b : boolean ) => {},
    conditionIdBeingEdited : 0,
    setConditionIdBeingEdited : (n : number) => {}
})
