import { ApiError } from "next/dist/server/api-utils";

interface ErrorDefaults {
    [statusCode: number]: {
        message: string;
        name: string;
    };
}

export const CONSTRAINT_ERROR_CODE = 409;

const defaults: ErrorDefaults = {
    400: { message: "Bad Request Format", name: "Bad Request" },
    404: { message: "Resource Not Found", name: "Not Found" },
    403: { message: "Unauthorized Access", name: "Forbidden" },
    [CONSTRAINT_ERROR_CODE]: {
        message: "Constraint Validation Failed",
        name: "Constraint Error",
    },
    500: { message: "Internal Server Error", name: "Server Error" },
};

export const getApiError = (
    statusCode: number,
    message?: string,
    name?: string
): ApiError => {
    return {
        statusCode: statusCode,
        message: message || defaults[statusCode].message || "Unknown Error",
        name: name || defaults[statusCode]?.message || "Unknown",
    };
};
