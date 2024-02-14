"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

export const ModalLogout = () => {
  const [open, setOpen] = useState(false);
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  useEffect(() => {
    if (status !== "loading") {
      if (status !== "authenticated") {
        redirect("/");
      }
    }
  }, []);

  const onClickAcept = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className="text-left flex justify-start">
        <Button className={cn("rounded-none w-full h-9 text-left flex items-start bg-red-600 hover:bg-red-700")}>
          Salir
          <LogOut className="w-4 h-4 ml-2" />
          </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            <div className="flex justify-between">Cerrar sesión</div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="w-full"></AlertDialogDescription>
        <span className="w-full">¿Está seguro que desea cerrar sesión?</span>
        <AlertDialogFooter className="gap-3">
          <Button
            className="bg-zinc-400 hover:bg-zinc-600"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button onClick={onClickAcept}>Aceptar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
