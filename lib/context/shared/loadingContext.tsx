import React, { createContext, useContext, useState, ReactNode } from "react";
import { CircularProgress, Modal, Box, Typography } from "@mui/material";

interface LoadingContextType {
    showLoading: (message?: string) => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
    showLoading: () => {},
    hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("");

    const showLoading = (message?: string) => {
        setLoadingMessage(message || "");
        setIsLoading(true);
    };

    const hideLoading = () => {
        setLoadingMessage("");
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            <Modal
                open={isLoading}
                aria-labelledby="loading-modal-title"
                aria-describedby="loading-modal-description"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        maxWidth: 400,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <CircularProgress color="primary" />
                    {loadingMessage && (
                        <Typography
                            id="loading-modal-description"
                            variant="body1"
                            mt={2}
                        >
                            {loadingMessage}
                        </Typography>
                    )}
                </Box>
            </Modal>
        </LoadingContext.Provider>
    );
};
