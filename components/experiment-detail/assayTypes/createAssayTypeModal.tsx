import CloseableModal from "@/components/shared/closeableModal";
import React, { useContext, useState } from "react";
import AssayTypeCreationContext from "@/lib/context/experimentDetailPage/assayTypeCreationContext";
import { Stack, TextField, Button } from "@mui/material";
import { useMutationToCreateCustomAssayType } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";

interface Field {
    field: string | null;
    setField: (s: string) => void;
    label: string;
    required: boolean;
}

export const CreateAssayTypeModal: React.FC = () => {
    const { isCreating, setIsCreating } = useContext(AssayTypeCreationContext);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string | null>(null);
    const [units, setUnits] = useState<string | null>(null);
    const experimentId = useExperimentId();
    const fields: Field[] = [
        { field: name, setField: setName, label: "Name", required: true },
        {
            field: description,
            setField: setDescription,
            label: "Description",
            required: false,
        },
        { field: units, setField: setUnits, label: "Units", required: false },
    ];
    const { mutate: createType } = useMutationToCreateCustomAssayType();

    return (
        <CloseableModal
            open={isCreating}
            closeFn={() => setIsCreating(false)}
            title="Create Custom Assay Type"
        >
            <Stack gap="3" direction="column">
                {fields.map((field, index) => (
                    <TextField
                        key={index}
                        value={field.field}
                        required={field.required}
                        label={field.label}
                        style={{ marginBottom: 8 }}
                        onChange={(e) => {
                            field.setField(e.target.value);
                        }}
                    />
                ))}

                <Button
                    variant="contained"
                    color="primary"
                    disabled={name.length < 1}
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                        createType({
                            description: description,
                            name: name,
                            units: units,
                            experimentId: experimentId,
                            technicianId: null,
                        });
                        setIsCreating(false);
                    }}
                >
                    Create Type
                </Button>
            </Stack>
        </CloseableModal>
    );
};
