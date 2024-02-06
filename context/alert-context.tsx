import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert, Container } from "@mui/material";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertInfo {
    type: AlertType;
    message: string;
}

const AlertContext = createContext<{
    showAlert: (type: AlertType, message: string) => void;
}>({ showAlert: () => {} });

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [alertQueue, setAlertQueue] = useState<AlertInfo[]>([]);

    const showAlert = (type: AlertType, message: string) => {
        setAlertQueue((prevQueue) => [...prevQueue, { type, message }]);
    };

    const hideAlert = () => {
        setAlertQueue((prevQueue) => prevQueue.slice(1));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alertQueue.length > 0 && (
                <Container
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Alert
                        severity={alertQueue[0].type}
                        onClose={hideAlert}
                        sx={{ width: "auto", borderRadius: 2 }}
                    >
                        {alertQueue[0].message}
                    </Alert>
                </Container>
            )}
        </AlertContext.Provider>
    );
};
