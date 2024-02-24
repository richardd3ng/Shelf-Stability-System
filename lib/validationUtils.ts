export type NumberType = "whole number" | "int" | "float";

export const getNumericalValidationError = (
    value: string,
    type?: NumberType
): string => {
    if (type === "whole number" && !/^\d+$/.test(value)) {
        return "Please enter a whole number.";
    } else if (type === "int" && !/^-?\d+$/.test(value)) {
        return "Please enter an integer.";
    } else if (type === "float" && !/^-?\d*\.?\d*$/.test(value)) {
        return "Please enter a valid number.";
    }
    return "";
};
