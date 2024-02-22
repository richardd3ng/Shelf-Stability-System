import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { NumberType } from "@/lib/validationUtils";
import { getNumericalValidationError } from "@/lib/validationUtils";
import { useAlert } from "@/lib/context/shared/alertContext";

interface EditableTextFieldProps {
    value?: string;
    label?: string;
    numberType?: NumberType;
    units?: string;
    defaultDisplayValue?: string;
    includeDelete?: boolean;
    multiline?: boolean;
    isEditing?: boolean;
    onEdit?: () => void;
    onSubmit: (value: string) => void;
}

const EditableLabel: React.FC<EditableTextFieldProps> = (
    props: EditableTextFieldProps
) => {
    const [value, setValue] = useState<string>(props.value || "");
    const [isEditing, setIsEditing] = useState<boolean>(
        props.isEditing || false
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State to track submission progress
    const { showAlert } = useAlert();
    const [resultText, setResultText] = useState<string>("");

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
        setIsEditing(props.isEditing || false);
    }, [props.isEditing]);

    useEffect(() => {
        setValue(props.value || "");
    }, [props.value]);

    const handleEdit = () => {
        setIsEditing(true);
        if (props.onEdit) {
            props.onEdit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true); // Set submission in progress
        if (props.numberType) {
            const error = getNumericalValidationError(value, props.numberType);
            if (error) {
                showAlert("error", error);
                return;
            }
        }
        props.onSubmit(value); // Assuming onSubmit is an asynchronous operation
        setIsEditing(false);
        setIsSubmitting(false); // Reset submission status after completion
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
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
                isSubmitting ? (
                    <CircularProgress sx={{ flex: 1 }} />
                ) : (
                    <IconButton onClick={handleSubmit} sx={{ flex: 1 }}>
                        <CheckIcon sx={{ color: "green" }} />
                    </IconButton>
                )
            ) : (
                <IconButton onClick={handleEdit} sx={{ marginRight: -1 }}>
                    <EditIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default EditableLabel;
