"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "../context/AlertContext"; 
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AlertProvider>{children}</AlertProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
