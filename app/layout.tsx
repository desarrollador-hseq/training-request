import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Roboto } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { ClientCookiesProvider } from "@/components/providers/cookies-provider";
import { NextAuthProvider } from "@/components/providers/nextauth-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "HSEQ Entrenamiento",
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
        <html lang="es" className={cn(roboto.className, "min-h-screen")}>
          <LoadingProvider>
            <Toaster richColors position="top-right" />
            <div className="min-h-[calc(100vh-40px)]">
              {children}

            </div>
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
