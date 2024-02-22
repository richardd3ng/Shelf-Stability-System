import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AlertProvider } from "@/lib/context/shared/alertContext";
import Head from "next/head";
import { LoadingProvider } from "@/lib/context/shared/loadingContext";

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <title>Shelf Stability System</title>
            </Head>
            <QueryClientProvider client={queryClient}>
                <LoadingProvider>
                    <AlertProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Component {...pageProps} />
                        </LocalizationProvider>
                    </AlertProvider>
                </LoadingProvider>
            </QueryClientProvider>
        </>
    );
}
