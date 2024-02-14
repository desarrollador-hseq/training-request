"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const NotValidCompany = ({email}: {email?: string | null}) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [counter, setCounter] = useState(20);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 1) {
      logout();
    }
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [counter]);

  const logout = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div>
      {isClient && (
        <AlertDialog open={true}>
          <AlertDialogContent className="w-full max-w-[700px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <h2 className="text-2xl text-bold">
                  ¡Empresa en proceso de verificación!
                </h2>
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-5 text-slate-700 text-lg flex flex-col gap-2 ">
                Su empresa está siendo verificada actualmente. Pronto recibirá
                una notificación por correo electrónico a ({email}), una vez que se complete
                el proceso.
               <span className="text-sm text-secondary my-2"> Lo invitamos a ingresar una vez haya recibido el correo de confirmación.</span>
              </AlertDialogDescription>
              <div className="flex items-center justify-center mt-5 bg-accent text-white gap-4 p-2 rounded-md">
                <p>Cierre de sesión automático en {counter} segundos.</p>
                <Button
                  className={"justify-self-center bg-muted hover:bg-muted/90"}
                  onClick={() => logout()}
                >
                  Salir
                </Button>
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
