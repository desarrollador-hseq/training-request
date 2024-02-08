"use client";

import { useLoading } from "@/components/providers/loading-provider";
import { SimpleModal } from "@/components/simple-modal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { useCollaboratorsCart } from "@/components/providers/collaborators-cart-provider";
import { Company } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

interface ButtonScheduleCollaboratorProps {
  isDisallowed: boolean;
  trainingRequestId?: string;
  collaboratorId?: string;
  collaboratorPhone?: string | null;
  collaboratorName?: string;
  courseName?: string;
  courseLevelName?: string;
  collaboratorCourseName?: string;
  trainingRequestCollaborator?: any;
  company?: Company;
  scheduledDate: { to: Date | null | undefined; from: Date | null | undefined };
  dateSelected: DateRange | undefined | null;
  date: DateRange | undefined | null;
}

export const ButtonScheduleCollaborator = ({
  trainingRequestId,
  collaboratorId,
  collaboratorName,
  collaboratorPhone,
  trainingRequestCollaborator,
  courseName,
  courseLevelName,
  dateSelected,
  scheduledDate,
  isDisallowed,
  date,
  company,
}: ButtonScheduleCollaboratorProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [notifyReschedule, setNotifyReschedule] = useState(false);
  const [trainingRequest, setTrainingRequest] = useState(
    trainingRequestCollaborator
  );
  const { addCartItem } = useCollaboratorsCart();
  const pathname = usePathname();
  useEffect(() => {
    setTrainingRequest(trainingRequestCollaborator);
  }, [trainingRequestCollaborator]);

  const handleScheduleDate = async () => {
    setLoadingApp(true);
    router.refresh();
    try {
      const { data } = await axios.patch(
        `/api/training-requests/${trainingRequestId}/members/${collaboratorId}/schedule`,
        { startDate: date?.from, endDate: date?.to }
      );
      console.log({ buttoncourse: collaboratorName });

      toast.success(
        !!!scheduledDate.from ? "Fecha guardada" : "Fecha reprogramada"
      );

      router.push(pathname);
    } catch (error) {
      toast.error(
        "Error al programar la fecha de formación, por favor intentelo nuevamente"
      );
    }

    if (!!!scheduledDate.from) {
      if (collaboratorPhone) {
        try {
          // await axios.post("/api/messages/", {
          //   msisdn: collaboratorPhone,
          //   message: `fue programado para asistir a una reunion el dia ${format(
          //     date?.from,
          //     "P",
          //     { locale: es }
          //   )}...`,
          // });
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
          // await axios.post("/api/messages/", {
          //   msisdn: collaboratorPhone,
          //   message: `fue programado para asistir a una reunion el dia ${format(
          //     date?.from,
          //     "P",
          //     { locale: es }
          //   )}...`,
          // });
          toast.success("SMS enviado");
        } catch (error) {
          toast.error("Error al enviar el mensaje de texto al colaborador");
          console.log({ errorApiSms: error });
        }
      }

      // todo: send email
    }

    setLoadingApp(false);

    addCartItem(
      company?.id!,
      company?.businessName!,
      company?.email!,
      collaboratorId!,
      collaboratorName!,
      trainingRequestCollaborator.courseLevel.course.name!,
      trainingRequestCollaborator.courseLevel.name!,
      date!
    );
  };

  return (
    <div className="w-full justify-center flex my-1">
      <SimpleModal
        btnDisabled={isDisallowed || !date}
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
