import React, { useState } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { NumberType } from "@/lib/validationUtils";
import { getNumericalValidationError } from "@/lib/validationUtils";
import { useAlert } from "@/lib/context/alert-context";

interface EditableTextFieldProps {
    value?: string;
    label?: string;
    numberType?: NumberType;
    units?: string;
    defaultDisplayValue?: string;
    includeDelete?: boolean;
    multiline?: boolean;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
}

const EditableLabel: React.FC<EditableTextFieldProps> = (
    props: EditableTextFieldProps
) => {
    const [value, setValue] = useState<string>(props.value || "");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { showAlert } = useAlert();
    let resultText: string = "";
    if (value && props.units) {
        resultText = `${value}${
            props.units.startsWith("%") ? props.units : ` ${props.units}`
        }`;
    } else {
        resultText = value || props.defaultDisplayValue || "";
    }

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSubmit = () => {
        if (props.numberType) {
            const error = getNumericalValidationError(value, props.numberType);
            if (error) {
                showAlert("error", error);
                return;
            }
        }
        setIsEditing(false);
        props.onSubmit(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        props.onChange(e.target.value);
    };

    return (
        <Box sx={{ alignItems: "center", display: "flex", width: "100%" }}>
            {props.label && !isEditing && (
                <Typography sx={{ paddingRight: 2 }}>{props.label}</Typography>
            )}
            {isEditing ? (
                <TextField
                    label={props.label}
                    multiline={props.multiline}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    sx={{ flex: 9, paddingRight: 1 }}
                />
            ) : (
                <Box sx={{ flex: 9 }}>
                    <Typography>{resultText}</Typography>
                </Box>
            )}
            {props.units && isEditing && (
                <Typography sx={{ paddingLeft: 0 }}>{props.units}</Typography>
            )}
            {isEditing ? (
                <IconButton onClick={handleSubmit} sx={{ flex: 1 }}>
                    <CheckIcon sx={{ color: "green" }} />
                </IconButton>
            ) : (
                <IconButton onClick={handleEdit} sx={{ marginRight: -1 }}>
                    <EditIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default EditableLabel;
