import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CloseableModal from "@/components/shared/closeableModal";
import EditableTextField from "@/components/shared/editableTextField";
import ConditionEditingContext from "@/lib/context/experimentDetailPage/conditionEditingContext";
import {
    useMutationToUpdateCondition,
    useMutationToSetConditionAsControl,
} from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import { useAlert } from "@/lib/context/shared/alertContext";

const ConditionEditorModal: React.FC = () => {
    const {
        isEditing,
        setIsEditing,
        id: conditionIdBeingEdited,
    } = useContext(ConditionEditingContext);
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const [originalName, setOriginalName] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [control, setControl] = useState<boolean>(false);
    const { mutate: updateCondition } = useMutationToUpdateCondition();
    const { mutate: setConditionAsControl } =
        useMutationToSetConditionAsControl();
    const { showAlert } = useAlert();

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
        setControl(condition.isControl || false);
    }, [conditionIdBeingEdited, data]);

    const handleSubmitName = (newName: string) => {
        if (newName) {
            updateCondition({
                id: conditionIdBeingEdited,
                name: newName,
            });
        } else {
            showAlert("error", "Condition name cannot be empty");
            setName(originalName);
        }
    };

    return (
        <CloseableModal
            open={isEditing}
            hideBackdrop
            closeFn={() => {
                setIsEditing(false);
            }}
            title="Edit Condition"
        >
            <Stack style={{ marginBottom: 8, marginRight: 4 }}>
                <EditableTextField
                    id="name"
                    value={name?.toString()}
                    label="Name:"
                    onSubmit={handleSubmitName}
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
