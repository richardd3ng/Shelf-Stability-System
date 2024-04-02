import { ApiError } from "next/dist/server/api-utils";

interface ErrorDefaults {
    [statusCode: number]: {
        message: string;
    };
}

export const UNAUTHORIZED_STATUS_CODE = 403;
export const CONSTRAINT_ERROR_CODE = 409;
export const CONFIRMATION_REQUIRED_MESSAGE = "Confirmation Required";

const defaults: ErrorDefaults = {
    400: { message: "Bad Request Format" },
    404: { message: "Resource Not Found" },
    [UNAUTHORIZED_STATUS_CODE]: {
        message: "Unauthorized Access",
    },
    [CONSTRAINT_ERROR_CODE]: {
        message: "Constraint Validation Failed",
    },
    500: { message: "Internal Server Error" },
};

export const getApiError = (statusCode: number, message?: string): ApiError => {
    return {
        statusCode: statusCode,
        message: message || defaults[statusCode].message || "Unknown Error",
        name: "ApiError",
    };
};
