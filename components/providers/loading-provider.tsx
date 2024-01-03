"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Loader2 } from "lucide-react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });

interface LoadingProps {
  setLoadingApp: Dispatch<SetStateAction<boolean | undefined>>;
  loadingApp: boolean | undefined;
}

interface Props {
  children: ReactNode;
}

export const LoadingContext = createContext<LoadingProps>({
  setLoadingApp: () => {},
  loadingApp: false,
});

export const LoadingProvider = ({ children }: Props) => {
  const [loadingApp, setLoadingApp] = useState<boolean | undefined>(true);

  useEffect(() => {
    try {
      setLoadingApp(false);
    } catch (error) {
      setLoadingApp(false);
    }finally {
      setLoadingApp(false);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoadingApp, loadingApp }}>
      <body
        className={cn(
          inter.className,
          loadingApp && "overflow-hidden",
          "bg-blue-100/40 relative"
        )}
      >
        {loadingApp && (
          <div className="backdrop-blur-sm bg-white/30 absolute top-0 left-0 w-full min-h-screen overflow-hidden z-40 bg-white flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        )}
        {children}
      </body>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
