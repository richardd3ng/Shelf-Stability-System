import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { NumberType } from "@/lib/validationUtils";
import { getNumericalValidationError } from "@/lib/validationUtils";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useEditGroup } from "@/lib/context/shared/editGroup";

interface EditableTextFieldProps {
    value?: string;
    label?: string;
    id: string;
    numberType?: NumberType;
    units?: string;
    defaultDisplayValue?: string;
    includeDelete?: boolean;
    multiline?: boolean;
    isEditing?: boolean;
    onSubmit: (value: string) => void;
}

const EditableLabel: React.FC<EditableTextFieldProps> = (
    props: EditableTextFieldProps
) => {
    const [value, setValue] = useState<string>(props.value || "");
    const [isEditing, setIsEditing] = useState<boolean>(
        props.isEditing || false
    );
    const { showAlert } = useAlert();
    const [resultText, setResultText] = useState<string>("");
    const { startEditing, stopEditing } = useEditGroup(props.id, () =>
        setIsEditing(false)
    );

    useEffect(() => {
        if ((props.value || value) && props.units) {
            setResultText(
                `${props.value || value}${
                    props.units.startsWith("%")
                        ? props.units
                        : ` ${props.units}`
                }`
            );
        } else {
            setResultText(
                props.value || value || props.defaultDisplayValue || ""
            );
        }
    }, [props.value, value, isEditing, props.units, props.defaultDisplayValue]);

    useEffect(() => {
        setValue(props.value || "");
    }, [props.value]);

    const handleEdit = () => {
        setIsEditing(true);
        startEditing();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (props.numberType) {
            const error = getNumericalValidationError(value, props.numberType);
            if (error) {
                showAlert("error", error);
                return;
            }
        }
        setIsEditing(false);
        stopEditing();
        props.onSubmit(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ alignItems: "center", display: "flex", width: "100%" }}>
                {props.label && !isEditing && (
                    <Typography sx={{ paddingRight: 2 }}>
                        {props.label}
                    </Typography>
                )}
                {isEditing ? (
                    <TextField
                        label={props.label}
                        multiline={props.multiline}
                        value={value}
                        onChange={handleChange}
                        autoFocus
                        sx={{ flex: 9, paddingRight: 1 }}
                    />
                ) : (
                    <Box sx={{ flex: 9 }}>
                        <Typography>{resultText}</Typography>
                    </Box>
                )}
                {props.units && isEditing && (
                    <Typography sx={{ paddingLeft: 0 }}>
                        {props.units}
                    </Typography>
                )}
                {isEditing ? (
                    <IconButton type="submit" sx={{ flex: 1 }}>
                        <CheckIcon sx={{ color: "green" }} />
                    </IconButton>
                ) : (
                    <IconButton onClick={handleEdit} sx={{ marginRight: -1 }}>
                        <EditIcon />
                    </IconButton>
                )}
            </Box>
        </form>
    );
};

export default EditableLabel;
