import { createContext } from "react";
import { INVALID_CONDITION_ID } from "@/lib/api/apiHelpers";

interface ConditionEditingContextType {
    id: number;
    setId: (id: number) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const ConditionEditingContext = createContext<ConditionEditingContextType>({
    id: INVALID_CONDITION_ID,
    setId: (_id: number) => {},
    isEditing: false,
    setIsEditing: (_isEditing: boolean) => {},
});

export default ConditionEditingContext;
