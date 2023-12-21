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
import { ReactNode } from "react";

interface ConfirmModalProps {
  children: ReactNode;
  title?: string;
  textBtn?: string;
}

export const SimpleModal = ({
  children,
  title,
  textBtn,
}: ConfirmModalProps) => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-accent ">{textBtn}</Button>
        </AlertDialogTrigger>

        <AlertDialogContent
          className={" lg:max-w-screen-lg overflow-y-scroll max-h-screen min-h-[300px]"}
        >
          <AlertDialogCancel
            asChild
            className="absolute top-7 right-7 flex w-full justify-end items-end"
          >
            <Button
              className="w-fit h-fit flex rounded-md bg-primary justify-center items-center p-1"
              variant="outline"
            >
              <X className="text-white" />
            </Button>
          </AlertDialogCancel>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              {title ? ` ${title}` : " datos"}{" "}
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
