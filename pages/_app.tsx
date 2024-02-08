import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AlertProvider } from "@/lib/context/alert-context";
import { Metadata } from "next";

export const metadata: Metadata = {
    icons: {
        icon: '/favicon.ico',
    }
};

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
    //const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AlertProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Component {...pageProps} />
                </ LocalizationProvider>
            </AlertProvider>
        </QueryClientProvider>
    );
}
