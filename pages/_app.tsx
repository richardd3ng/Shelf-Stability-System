import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AlertProvider } from "@/lib/context/alert-context";
import Head from "next/head";
import { CurrentUserProvider } from "@/lib/context/users/currentUserContext";

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <title>Shelf Stability System</title>
            </Head>
            <QueryClientProvider client={queryClient}>
                <AlertProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CurrentUserProvider>
                            <Component {...pageProps} />
                        </CurrentUserProvider>
                    </ LocalizationProvider>
                </AlertProvider>
            </QueryClientProvider>
        </>
    );
}
