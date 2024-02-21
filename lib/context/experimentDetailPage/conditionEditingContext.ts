import { INVALID_CONDITION_ID } from "@/lib/api/apiHelpers";
import { createContext } from "react";

interface ConditionEditingContextType {
    isEditing: boolean;
    setIsEditing: (b: boolean) => void;
    conditionIdBeingEdited: number;
    setConditionIdBeingEdited: (n: number) => void;
}

export const ConditionEditingContext =
    createContext<ConditionEditingContextType>({
        isEditing: false,
        setIsEditing: (b: boolean) => {},
        conditionIdBeingEdited: INVALID_CONDITION_ID,
        setConditionIdBeingEdited: (n: number) => {},
    });
