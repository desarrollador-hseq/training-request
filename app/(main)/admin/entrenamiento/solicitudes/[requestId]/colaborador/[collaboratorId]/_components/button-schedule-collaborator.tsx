"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { Company } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useLoading } from "@/components/providers/loading-provider";
import { useCollaboratorsCart } from "@/components/providers/collaborators-cart-provider";
import { SimpleModal } from "@/components/simple-modal";

interface ButtonScheduleCollaboratorProps {
  isDisallowed: boolean;
  trainingRequestId?: string;
  collaboratorId?: string;
  collaboratorPhone?: string | null;
  collaboratorName?: string;
  courseName?: string | null;
  shortName?: string | null;
  collaboratorMail?: string | null;
  levelName?: string | null;
  trainingRequestCollaborator?: any;
  company?: Company | null;
  scheduledDate: { to: Date | null | undefined; from: Date | null | undefined };
  date: DateRange | undefined | null;
  canManagePermissions: boolean;
}

export const ButtonScheduleCollaborator = ({
  trainingRequestId,
  collaboratorId,
  collaboratorName,
  collaboratorPhone,
  courseName,
  shortName,
  levelName,
  collaboratorMail,
  scheduledDate,
  isDisallowed,
  date,
  company,
  canManagePermissions,
}: ButtonScheduleCollaboratorProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [notifyReschedule, setNotifyReschedule] = useState(false);

  const { addCartItem, cartItems } = useCollaboratorsCart();
  const pathname = usePathname();

  const handleScheduleDate = async () => {
    setLoadingApp(true);
    // router.refresh();
    console.log({ collaboratorMail });
    const colData = {
      name: collaboratorName,
      companyName: company?.businessName,
      courseName: courseName,
      levelName: levelName,
      courseDate: date,
      email: collaboratorMail,
    };

    try {
      const { data } = await axios.patch(
        `/api/training-requests/${trainingRequestId}/members/${collaboratorId}/schedule`,
        { startDate: date?.from, endDate: date?.to }
      );

      toast.success(
        !!!scheduledDate.from ? "Fecha guardada" : "Fecha reprogramada"
      );

      router.push(pathname);
      router.refresh();
    } catch (error) {
      toast.error(
        "Error al programar la fecha de formación, por favor intentelo nuevamente"
      );
    }

    if (!!!scheduledDate.from) {
      if (collaboratorPhone) {
        try {
          await axios.post("/api/messages/", {
            msisdn: collaboratorPhone,
            message: `[GRUPOHSEQ] informa que ud ha sido inscrito a curso: ${
              levelName === courseName ? shortName :  `${courseName} - ${levelName}` 
            }, dia ${format(date?.from!, "P", {
              locale: es,
            })} 7:30am ubicacion: calle30#10-232 L-1 requisito: https://bit.ly/3T9vy8h`,
          });
          toast.success("SMS enviado");
        } catch (error) {
          toast.error("Error al enviar el mensaje de texto al colaborador");
          console.log({ errorApiSms: error });
        }
      }
      if (collaboratorMail) {
        // send email
        try {
          await axios.post(`/api/mail/collaborator-programmed`, {
            collaborator: colData,
            rescheduled: false,
          });
          toast.success("Correo enviado");
        } catch (error) {
          toast.error("Error al enviar correo de confirmación al colaborador");
          console.log({ errorApieMAIL: error });
        }
      }
    } else if (notifyReschedule) {
      if (collaboratorPhone) {
        try {
          await axios.post("/api/messages/", {
            msisdn: collaboratorPhone,
            message: `[GRUPOHSEQ] informa que ud ha sido inscrito a curso: ${
              levelName === courseName ? shortName :  `${courseName} - ${levelName}` 
            }, dia ${format(date?.from!, "P", {
              locale: es,
            })} 7:30am ubicacion: calle30#10-232 L-1 requisito: https://bit.ly/3T9vy8h`,
          });
          toast.success("SMS reprogramacion enviado");
        } catch (error) {
          toast.error("Error al enviar el mensaje de texto al colaborador");
          console.log({ errorApiSms: error });
        }
      }
      if (collaboratorMail) {
        // send email reprogrammed
        try {
          await axios.post(`/api/mail/collaborator-programmed`, {
            collaborator: colData,
            rescheduled: true,
          });
          toast.success("Correo de reprogramación enviado");
        } catch (error) {
          toast.error("Error al enviar correo de confirmación al colaborador");
          console.log({ errorApieMAIL: error });
        }
      }
    }

    setLoadingApp(false);

    addCartItem(
      company?.id!,
      company?.businessName!,
      company?.email!,
      collaboratorId!,
      collaboratorName!,
      courseName!,
      levelName!,
      date!
    );
  };

  return (
    <div className="w-full justify-center flex my-1">
      <SimpleModal
        btnDisabled={isDisallowed || !date || !canManagePermissions}
        btnClass="w-[50%] shadow-sm"
        textBtn={!!!scheduledDate.from ? "Programar" : "Reprogramar"}
        onAcept={() => handleScheduleDate()}
        title={
          !!!scheduledDate.from
            ? "Programar colaborador"
            : "Reprogramar al colaborador"
        }
      >
        {!!date?.from && !!date.to && (
          <div>
            {!!!scheduledDate?.from && !!!scheduledDate?.to ? (
              <p>
                Desea programar el colaborador {collaboratorName}, desde el día
                {format(date?.from, "PPP", { locale: es })} hasta el día
                {format(date?.to, "PPP", { locale: es })}
              </p>
            ) : (
              <div>
                <p>
                  Desea reprogramar el colaborador:{" "}
                  <span className="font-bold">{collaboratorName}</span>, desde
                  el día{" "}
                  <span className="font-bold">
                    {format(date?.from, "PPP", { locale: es })}
                  </span>{" "}
                  hasta el día{" "}
                  <span className="font-bold">
                    {format(date?.to, "PPP", { locale: es })}
                  </span>
                </p>
                <div className="items-top flex space-x-2 border-2 border-slate-300 my-3 p-2">
                  <Checkbox
                    id="notify"
                    checked={notifyReschedule}
                    onCheckedChange={(e) => setNotifyReschedule(!!e)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="notify"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Volver a notificar la fecha de inicio del curso por sms y
                      correo electrónico al colaborador
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </SimpleModal>
    </div>
  );
};
