import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CloseableModal } from "@/components/shared/closeableModal";
import EditableTextField from "@/components/shared/editableTextField";
import { ConditionEditingContext } from "@/lib/context/experimentDetailPage/conditionEditingContext";
import {
    useMutationToUpdateCondition,
    useMutationToSetConditionAsControl,
} from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";

const ConditionEditorModal: React.FC = () => {
    const { isEditing, setIsEditing, conditionIdBeingEdited } = useContext(
        ConditionEditingContext
    );
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const [originalName, setOriginalName] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [control, setControl] = useState<boolean>(false);
    const { mutate: updateCondition } = useMutationToUpdateCondition();
    const { mutate: setConditionAsControl } =
        useMutationToSetConditionAsControl();

    useEffect(() => {
        if (!data) {
            return;
        }
        const condition = data.conditions.find(
            (condition) => condition.id === conditionIdBeingEdited
        );
        if (!condition) {
            return;
        }
        setName(condition.name);
        setOriginalName(condition.name);
        setControl(condition.control || false);
    }, [conditionIdBeingEdited, data]);

    const handleChangeName = () => {
        if (name) {
            updateCondition({
                id: conditionIdBeingEdited,
                name: name,
            });
        } else {
            setName(originalName);
        }
    };

    return (
        <CloseableModal
            open={isEditing}
            hideBackdrop
            closeFn={() => setIsEditing(false)}
            title="Edit Condition"
        >
            <Stack style={{ marginBottom: 8, marginRight: 4 }}>
                <EditableTextField
                    value={name?.toString()}
                    label="Name:"
                    onChange={setName}
                    onSubmit={handleChangeName}
                />
                {(!control && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={control}
                                onChange={() =>
                                    setConditionAsControl(
                                        conditionIdBeingEdited
                                    )
                                }
                            />
                        }
                        label="Set as control condition"
                    />
                )) || <Typography>This is the control condition</Typography>}
            </Stack>
        </CloseableModal>
    );
};

export default ConditionEditorModal;
