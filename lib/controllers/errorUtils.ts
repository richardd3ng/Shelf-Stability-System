export const formatError = (statusCode: number, message: string): string => {
    return `${statusCode} ${message}`;
};
