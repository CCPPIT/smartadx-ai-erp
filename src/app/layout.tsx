import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import { TRPCProvider } from "@/lib/trpc-react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "SmartAdX AI ERP",
  description: "Revolutionary AI-powered advertising and ERP system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <TRPCProvider>
          <AuthProvider>
            <ClientBody>
              <Toaster/>
              {children}
            </ClientBody>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}