import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface EditGroupContextType {
    registerField: (field: string, onStopEditing: () => void) => void;
    startEditing: (field: string) => void;
    stopEditing: () => void;
}

const EditGroupContext = createContext<EditGroupContextType>({
    registerField: () => { },
    startEditing: () => { },
    stopEditing: () => { },
});

export const useEditGroup = (id: string, onStopEditing: () => void) => {
    const context = useContext(EditGroupContext);

    // Note: I should probably make a way to unregister these on change
    useEffect(() => {
        context.registerField(id, onStopEditing);
    }, [id]);

    return {
        startEditing: () => context.startEditing(id),
        stopEditing: context.stopEditing
    }
};

export interface EditGroupProps {
    editable?: boolean;
    children: ReactNode;
}

// This component is used to manage the state of a group of editable fields, where only one can be edited at a time.
export const EditGroup: React.FC<EditGroupProps> = ({
    editable,
    children,
}) => {
    const [fields, setFields] = useState<string[]>([]);
    const [stopEditingCallbacks, setStopEditingCallbacks] = useState<Record<string, () => void>>({});
    const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null);

    function startEditing(field: string) {
        if (!fields.includes(field)) {
            throw new Error(`Field ${field} is not registered`);
        }
        if (currentlyEditing !== null) {
            stopEditingCallbacks[currentlyEditing]();
        }
        setCurrentlyEditing(field);
    }

    function stopEditing() {
        if (currentlyEditing === null) {
            return;
        }
        stopEditingCallbacks[currentlyEditing]();
        setCurrentlyEditing(null);
    }

    useEffect(() => {
        if (editable === false) {
            stopEditing();
        }
    }, [editable]);

    function registerField(field: string, onStopEditing: () => void) {
        setFields((prevFields) => [...prevFields, field]);
        setStopEditingCallbacks((prevCallbacks) => ({ ...prevCallbacks, [field]: onStopEditing }));
    }

    return (
        <EditGroupContext.Provider value={{ registerField, startEditing, stopEditing }}>
            {children}
        </EditGroupContext.Provider>
    );
};

