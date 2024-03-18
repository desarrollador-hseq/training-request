"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const ModalCertificateWasCreated = ({}: {}) => {
  const [open, setOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {isClient && (
        <AlertDialog open={open}>
          <AlertDialogContent className="w-full max-w-[700px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <span className="text-2xl text-bold">¡Atención!</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-5 text-slate-700 text-lg flex flex-col gap-2 ">
                Ya existe un certificado para este colaborador en el mismo curso
                y nivel, y bajo la misma empresa. Por favor, verifica los
                detalles del certificado existente antes de continuar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <Button onClick={handleClose}>Aceptar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
