import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AlertProvider } from "@/context/alert-context";

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
