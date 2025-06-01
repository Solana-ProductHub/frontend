import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/Route.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import SolanaProvider from "./providers/SolanaProvider.tsx";

window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    typeof event.reason.message === "string" &&
    event.reason.message.includes("A listener indicated an asynchronous response")
  ) {
    // Suppress this extension error
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRoutes />
        <Toaster />
      </ThemeProvider>
    </SolanaProvider>
  </StrictMode>
);
