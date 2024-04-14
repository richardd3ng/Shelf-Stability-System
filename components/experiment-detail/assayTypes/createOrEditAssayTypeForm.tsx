import React from "react";
import { Stack, TextField, Button } from "@mui/material";
import { UserSelector } from "@/components/shared/userSelector";



interface Field {
    field: string | null;
    setField: (s: string) => void;
    label: string;
    required: boolean;
}
interface CreateOrEditAssayTypeFormProps {
    name : string;
    setName : (s : string) => void;
    description : string | null;
    setDescription : (s : string | null) => void;
    units : string | null;
    setUnits : (s : string | null) => void;
    technicianId : number | null;
    setTechnicianId : (id : number | null) => void;
    onSubmit : () => void;
    disableTextFields : boolean;
    buttonText : string;
}


export const CreateOrEditAssayTypeForm: React.FC<CreateOrEditAssayTypeFormProps> = (props : CreateOrEditAssayTypeFormProps) => {
    const fields: Field[] = [
        { field: props.name, setField: props.setName, label: "Name", required: true },
        { field: props.description, setField: props.setDescription, label: "Description", required: false},
        { field: props.units, setField: props.setUnits, label: "Units", required: false },
    ];

    return (
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
                    disabled={props.disableTextFields}
                />
            ))}
            <UserSelector userId={props.technicianId ? props.technicianId : -1} includeNoneOption={true} setUserId={async (uid : number | null) => {
                props.setTechnicianId(uid);
            }}/>

            <Button
                variant="contained"
                color="primary"
                disabled={props.name.length < 1}
                sx={{ textTransform: "none", marginTop : 4 }}
                onClick={() => props.onSubmit()}
            >
                {props.buttonText}
            </Button>
        </Stack>

    );
};
