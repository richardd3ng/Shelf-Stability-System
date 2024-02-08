import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AlertProvider } from "@/lib/context/alert-context";
import Head from "next/head";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
    //const queryClient = new QueryClient();

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <title>Shelf Stability System</title>
            </Head>
            <QueryClientProvider client={queryClient}>
                <AlertProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Component {...pageProps} />
                    </ LocalizationProvider>
                </AlertProvider>
            </QueryClientProvider>
        </>
    );
}
