import React, { useState } from "react";
import { TextField } from "@mui/material";

type numberType = "whole number" | "int" | "float";

interface NumericalTextFieldProps {
    label: string;
    errorText: string;
    type: numberType;
    onChange: (value: string) => void;
    onSubmit: (value: number) => void;
}

export const getNumericalValidationError = (
    value: string,
    type: numberType
): string => {
    if (type === "whole number" && !/^\d+$/.test(value)) {
        return "Please enter a whole number.";
    } else if (type === "int" && !/^-?\d+$/.test(value)) {
        return "Please enter an integer.";
    } else if (type === "float" && !/^-?\d*\.?\d*$/.test(value)) {
        return "Please enter a floating-point number.";
    }
    return "";
};

const NumericalTextField: React.FC<NumericalTextFieldProps> = (
    props: NumericalTextFieldProps
) => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue: string = event.target.value;
        const err = getNumericalValidationError(inputValue, props.type);
        setError(err);
        props.onChange(inputValue);
        setValue(inputValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (error) {
                return;
            }
            props.onSubmit(Number(value));
        }
    };

    return (
        <TextField
            label={props.label}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            variant="outlined"
        />
    );
};

export default NumericalTextField;
