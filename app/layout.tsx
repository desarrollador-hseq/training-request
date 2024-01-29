import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { ClientCookiesProvider } from "@/components/providers/cookies-provider";
import { NextAuthProvider } from "@/components/providers/nextauth-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GRUPO HSEQ - EMPRESAS",
  description: "empresas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientCookiesProvider value={cookies().getAll()}>
      <NextAuthProvider>
        <html lang="es">
          <LoadingProvider>
            <Toaster richColors position="top-right" />
            {children}
            <footer className="footer h-10 w-full bg-primary flex items-center">
              <div className="w-[70%] mx-auto flex justify-center gap-1 text-white text-sm">
                <span>2024</span>
                <p className="text-sm">&copy; Todos los derechos reservados.</p>
              </div>
            </footer>
          </LoadingProvider>
        </html>
      </NextAuthProvider>
    </ClientCookiesProvider>
  );
}
