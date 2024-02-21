import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
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
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    onDelete?: () => void;
}

const EditableLabel: React.FC<EditableTextFieldProps> = (
    props: EditableTextFieldProps
) => {
    const [value, setValue] = useState<string>(props.value || "");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { showAlert } = useAlert();
    const resultText: string =
        value && props.units
            ? `${value}${
                  props.units.startsWith("%") ? props.units : ` ${props.units}`
              }`
            : props.defaultDisplayValue || "";

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDelete = () => {
        setIsEditing(false);
        setValue("");
        if (props.onDelete) {
            props.onDelete();
        }
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
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    sx={{ flex: 9, paddingRight: 1 }}
                />
            ) : (
                <Box sx={{ flex: 9 }}>
                    <Typography width="100%">{resultText}</Typography>
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
                <Box sx={{ alignItems: "center", display: "flex", flex: 1 }}>
                    <IconButton onClick={handleEdit} sx={{ marginRight: -1 }}>
                        <EditIcon />
                    </IconButton>
                    {props.onDelete && (
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default EditableLabel;
