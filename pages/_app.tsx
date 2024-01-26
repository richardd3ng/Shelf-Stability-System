import "@/styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "react-query";

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Component {...pageProps} />
    		</LocalizationProvider>
		</QueryClientProvider>
	);
}
