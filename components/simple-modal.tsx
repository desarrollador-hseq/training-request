"use client";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  children: ReactNode;
  title?: string;
  textBtn?: ReactNode ;
  btnClass?: string;
}

export const SimpleModal = ({
  children,
  title,
  textBtn,
  btnClass
}: ConfirmModalProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className={cn("bg-accent", btnClass)}>{textBtn}</Button>
        </AlertDialogTrigger>

        <AlertDialogContent
          className={
            " lg:max-w-screen-lg overflow-y-scroll max-h-screen min-h-[300px]"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              <div className="flex justify-between">
                {`${title}`}
                <Button
                  className="w-fit h-fit flex rounded-md justify-center items-center p-1 hover:bg-slate-50"
                  variant="outline"
                  onClick={handleClose}
                >
                  <X className="text-red-500" />
                </Button>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="w-full"></AlertDialogDescription>
          <span className="w-full">{children}</span>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
