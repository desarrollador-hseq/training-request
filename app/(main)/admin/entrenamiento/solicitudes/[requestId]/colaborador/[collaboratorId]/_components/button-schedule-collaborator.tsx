"use client";

import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";

interface ButtonScheduleCollaboratorProps {
  isDisallowed: boolean;
  trainingRequestId?: string;
  collaboratorId?: string;
  collaboratorPhone?: string | null;
  collaboratorName?: string;
  scheduledDate: { to: Date | null | undefined; from: Date | null | undefined };
  dateSelected: DateRange | undefined | null;
  date: DateRange | undefined | null;
}

export const ButtonScheduleCollaborator = ({
  trainingRequestId,
  collaboratorId,
  dateSelected,
  scheduledDate,
  isDisallowed,
  date,
  collaboratorName,
  collaboratorPhone,
}: ButtonScheduleCollaboratorProps) => {
  const { setLoadingApp } = useLoading();
  const [notifyReschedule, setNotifyReschedule] = useState(false);

  const handleScheduleDate = async () => {
    setLoadingApp(true);
    try {
      await axios.patch(
        `/api/training-requests/${trainingRequestId}/members/${collaboratorId}/schedule`,
        { startDate: date?.from, endDate: date?.to }
      );

      toast.success(
        !!!scheduledDate.from ? "Fecha guardada" : "Fecha reprogramada"
      );
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
            message: `fue programado para asistir a una reunion el dia ${format(
              date?.from,
              "P",
              { locale: es }
            )}...`,
          });
          toast.success("SMS enviado");
        } catch (error) {
          toast.error("Error al enviar el mensaje de texto al colaborador");
          console.log({ errorApiSms: error });
        }
      }
      // todo: send email
    } else if (notifyReschedule) {
      if (collaboratorPhone) {
        try {
          await axios.post("/api/messages/", {
            msisdn: collaboratorPhone,
            message: `fue programado para asistir a una reunion el dia ${format(
              date?.from,
              "P",
              { locale: es }
            )}...`,
          });
          toast.success("SMS enviado");
        } catch (error) {
          toast.error("Error al enviar el mensaje de texto al colaborador");
          console.log({ errorApiSms: error });
        }
      }

      // todo: send email
    }

    setLoadingApp(false);
  };
  return (
    <div>
      {/* <Button className="">Programar</Button> */}
      <SimpleModal
        btnDisabled={isDisallowed || !date}
        btnClass=""
        textBtn={!!!scheduledDate.from ? "Programar" : "Reprogramar"}
        onAcept={() => handleScheduleDate()}
        title={
          !!!scheduledDate.from
            ? "Programar colaborador"
            : "Reprogramar al colaborador"
        }
      >
        {!!dateSelected?.from && !!dateSelected.to && (
          <div>
            {!!!scheduledDate?.from && !!!scheduledDate?.to ? (
              <p>
                Desea programar el colaborador {collaboratorName}, desde el día
                {format(dateSelected?.from, "PPP", { locale: es })} hasta el día
                {format(dateSelected?.to, "PPP", { locale: es })}
              </p>
            ) : (
              <div>
                <p>
                  Desea reprogramar el colaborador:{" "}
                  <span className="font-bold">{collaboratorName}</span>, desde
                  el día{" "}
                  <span className="font-bold">
                    {format(dateSelected?.from, "PPP", { locale: es })}
                  </span>{" "}
                  hasta el día{" "}
                  <span className="font-bold">
                    {format(dateSelected?.to, "PPP", { locale: es })}
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
