"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ModalWaitValidation = () => {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className={""}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Notificación por correo</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="w-full"></AlertDialogDescription>
        <span className="w-full">
          Se le notificará al correo registrado cuando se hayan válidado los
          datos para que pueda ingresar
        </span>
        <AlertDialogFooter>
          <AlertDialogAction>Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
