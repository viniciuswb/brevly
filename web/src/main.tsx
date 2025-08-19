import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
			<Toaster
				position="bottom-right"
				toastOptions={{
					duration: 5000,
				}}
			/>
		</QueryClientProvider>
	</StrictMode>,
);
