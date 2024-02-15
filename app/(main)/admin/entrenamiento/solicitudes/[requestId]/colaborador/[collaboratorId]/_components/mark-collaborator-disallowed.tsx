"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MarkCollaboratorDisallowedProps {
  setIsDisallowed: Dispatch<SetStateAction<boolean>>;
  isDisallowed?: boolean;
  trainingRequestCollaboratorId?: string;
  collaboratorId?: string;
  emailResponsibleCompany?: string;
  colName?: string;
  colDocument?: string;
  courseName?: string | null;
  trainingRequestId?: string;
  levelName?: string | null;
  toEmail?: string | null;
}

export const MarkCollaboratorDisallowed = ({
  isDisallowed,
  setIsDisallowed,
  trainingRequestCollaboratorId,
  collaboratorId,
  colName,
  toEmail,
  colDocument,
  courseName,
  levelName,
  trainingRequestId,
  emailResponsibleCompany,
}: MarkCollaboratorDisallowedProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [notifyEmailDisallowed, setNotifyEmailDisallowed] =
    useState<boolean>(false);
  const [disallowedMessage, setDisallowedMessage] = useState<
    string | undefined
  >();

  const handleDisallowed = async () => {
    setLoadingApp(true);

    try {
      await axios.patch(
        `/api/training-requests/${trainingRequestCollaboratorId}/members/${collaboratorId}/${
          isDisallowed ? "allowed" : "disallowed"
        }`
      );
      setIsDisallowed(isDisallowed ? false : true);
      isDisallowed
        ? toast.success("Colaborador marcado como admitido")
        : toast.info("Colaborador marcado como no autorizado");
      router.refresh();
    } catch (error) {
      toast.error(
        "Error al marcar al colaborador que no cumple con información, por favor intentelo nuevamente"
      );
    }

    if (notifyEmailDisallowed) {
      try {
        console.log("disallowed");

        await axios.post(`/api/mail/collaborator-disallowed`, {
          textContent: disallowedMessage,
          toEmail,
          name: colName,
          document: colDocument,
          level: levelName,
          course: courseName,
          link: `/dashboard/entrenamiento/solicitudes/editar/${trainingRequestId}`,
        });
        toast.info("Correo enviado correctamente");
      } catch (error) {
        toast.error(
          "Error al enviar el correo de notificación a la persona responsable de la plataforma"
        );
        console.log({ errorApiSms: error });
      }
    }

    setLoadingApp(false);
  };

  const resetFieldsModal = () => {
    setNotifyEmailDisallowed(false);
    setDisallowedMessage("");
  };

  return (
    <SimpleModal
      onClose={() => resetFieldsModal()}
      onAcept={() => handleDisallowed()}
      btnClass={`p-2 bg-red-500 ${
        isDisallowed
          ? "bg-green-600 hover:bg-green-800"
          : "bg-red-500 hover:bg-red-700"
      }`}
      textBtn={
        isDisallowed ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )
      }
      title={isDisallowed ? "Marcar como admitido" : "Marcar como no admitido"}
    >
      <p className="mb-3">
        {isDisallowed
          ? "El colaborador cumple como los requisitos"
          : "Desea marcar el colaborador tiene documento incorrectos o vencidos"}
      </p>
      {!isDisallowed && (
        <div className="items-top flex space-x-2 border-2 border-slate-300 my-3">
          <Checkbox
            id="notify"
            checked={notifyEmailDisallowed}
            onCheckedChange={(e) => setNotifyEmailDisallowed(!!e)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="notify"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notificar por correo al responsable de la empresa
            </label>
            <p className="text-sm text-muted-foreground">
              {emailResponsibleCompany}
            </p>
          </div>
        </div>
      )}

      {notifyEmailDisallowed && (
        <Label>
          Detalles del incumplimiento
          <Textarea
            value={disallowedMessage}
            onChange={(e) => setDisallowedMessage(e.target.value)}
          />
        </Label>
      )}
    </SimpleModal>
  );
};
