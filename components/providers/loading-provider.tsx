"use client";

import { Roboto } from "next/font/google";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { LoaderFullpage } from "../loader-fullpage";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

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
  const [isclient, setIsclient] = useState(false);
  const [loadingApp, setLoadingApp] = useState<boolean | undefined>(true);

  useEffect(() => {
    setIsclient(true);
  }, []);

  useEffect(() => {
    try {
      if (isclient) {
        setLoadingApp(false);
      }
    } catch (error) {
      setLoadingApp(false);
    } finally {
      setLoadingApp(false);
    }
  }, [isclient]);

  return (
    <LoadingContext.Provider value={{ setLoadingApp, loadingApp }}>
      <body
        className={cn(
          loadingApp && "overflow-hidden",
          "bg-blue-100/40 relative"
        )}
      >
        {loadingApp && <LoaderFullpage />}
        {children}
      </body>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
