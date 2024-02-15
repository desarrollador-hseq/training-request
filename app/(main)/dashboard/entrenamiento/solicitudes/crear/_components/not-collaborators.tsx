"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const NotCollaborators = ({ open }: { open: boolean }) => {
  const [isOpen, setIsOpen] = useState(open);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className="w-full max-w-[700px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <h2 className="text-xl text-bold">
                  Aún no tienes colaboradores registrados.
                </h2>
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-5 text-slate-700 text-lg ">
                Para crear y gestionar una solicitud debes de registrar al menos
                un colaborador, puedes añadir uno a uno o puedes cargar un
                archivo Excel con los colaboradores que desees registrar.
              </AlertDialogDescription>
              <div className="flex justify-center mt-5">
                <Link
                  className={cn(buttonVariants(), "justify-self-center")}
                  href={`/dashboard/entrenamiento/colaboradores/crear`}
                >
                  Ir a registrar colaboradores
                </Link>
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
