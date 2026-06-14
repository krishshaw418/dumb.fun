import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SolanaProvider } from "./lib/solana-provider.tsx";
import { Toaster } from "@/components/ui/sonner";
import { UmiProvider } from "./lib/umi-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaProvider>
      <UmiProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontWeight: "lighter",
              fontFamily: "JetBrains Mono Variable",
              color: "white",
              backgroundColor: "#212225",
            },
          }}
        />
      </UmiProvider>
    </SolanaProvider>
  </StrictMode>,
);
