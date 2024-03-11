import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

import "./globals.css";
import { ClientCookiesProvider } from "@/components/providers/cookies-provider";
import { NextAuthProvider } from "@/components/providers/nextauth-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { cronCertificateToExpireSoons } from "@/scripts/cron-jobs";

export const metadata: Metadata = {
  title: {
    // absolute: "sf",
    default: "Entrenamiento",
    template: "%s | HSEQ Entrenamiento",
  },
  description: "HSEQ Entrenamiento - Agendamiento y certificados en trabajo en altura en la ciudad de barranquilla y colombia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // cron para enviar email antes de vencer certificado. 1mes
  cronCertificateToExpireSoons();

  return (
    <ClientCookiesProvider value={cookies().getAll()}>
      <NextAuthProvider>
        <html lang="es" className={"min-h-screen"}>
          <LoadingProvider>
            <Toaster richColors position="top-right" />

            <div className="min-h-[calc(100vh-40px)]">{children}</div>
          </LoadingProvider>
        </html>
      </NextAuthProvider>
    </ClientCookiesProvider>
  );
}
