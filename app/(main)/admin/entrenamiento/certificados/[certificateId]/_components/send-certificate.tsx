"use client";

import { useRouter } from "next/navigation";
import { Certificate } from "@prisma/client";
import axios from "axios";
import { ActivitySquare, BookmarkCheck, Send, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export const SendCertificate = ({
  certificate,
  canManagePermissions,
  companyContact,
  companyEmail,
}: {
  certificate?: Certificate;
  canManagePermissions: boolean;
  companyContact?: string | null;
  companyEmail?: string | null;
}) => {
  const { loadingApp, setLoadingApp } = useLoading();
  const router = useRouter();

  const handleSend = async () => {
    setLoadingApp(true);
    try {
      if (certificate?.wasSent) {
        await axios.post(`/api/certificates/${certificate?.id}/unsend`);

        toast.info("Se ha anulado el envio del certificado");
      } else {
        await axios.post(`/api/certificates/${certificate?.id}/send`);

        toast.success("Se ha enviado el certificado correctamente");
        try {
          await axios.post(`/api/mail/certificate-created`, {
            certificate: {
              collaboratorFullname: certificate?.collaboratorFullname,
              course: certificate?.courseName,
              level:
                certificate?.courseName === certificate?.levelName
                  ? null
                  : certificate?.levelName,
              companyContact: companyContact,
              certificateId: certificate?.id,
            },
            email: companyEmail,
          });
          toast.info("Correo enviado correctamente")
        } catch (error) {
          toast.error("Ocurrió un error al notificar por correo a la empresa");
        }
      }

      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (typeof errorMessage === "string") {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Ocurrió un error inesperado");
        }
      } else {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      }
    } finally {
      setLoadingApp(false);
    }
  };

  const content = (
    <div className="font-normal inline">
      {certificate?.wasSent
        ? "¿Desea anular el envio del certificado de: "
        : "¿Desea enviar el certificado de: "}{" "}
      <span className="font-bold "> {certificate?.collaboratorFullname}</span> -
      <span className="font-bold "> {certificate?.courseName}</span> -
      <span className="font-bold "> {certificate?.levelName}</span> -
      <span>{certificate?.companyName}</span> ?
    </div>
  );

  return (
    <div className="w-full flex justify-end mt-5">
      {certificate?.active && (
        <SimpleModal
          large={false}
          textBtn={
            <div className="w-fit h-6 flex gap-2 items-center">
              {certificate.wasSent ? (
                <>
                  <BookmarkCheck /> Enviado a la empresa
                </>
              ) : (
                <>
                  <Send /> Enviar a la empresa
                </>
              )}
            </div>
          }
          title="¿Eliminar certificado?"
          onAcept={handleSend}
          btnClass={cn(
            "w-fit mr-5",
            certificate.wasSent
              ? " bg-slate-500 hover:bg-slate-600"
              : " bg-emerald-700 hover:bg-emerald-800"
          )}
          btnDisabled={!canManagePermissions}
        >
          {content}
        </SimpleModal>
      )}
    </div>
  );
};
